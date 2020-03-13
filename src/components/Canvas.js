import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';
import { Paper } from '@material-ui/core';

import { fabricOptionsOveride } from '../config/fabric.config';
import data from '../data/fabric';
import { addUndoRedo, addFabricKeyListener } from '../modules/fabric.module';

import { preventOutsideMovement } from '../utilty/canvass_helper.js';
console.log(data);
const Canvas = () => {
  const { fabricRef, setSelectedObject, selectedObject } = React.useContext(
    AppContext
  );
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const handleUserKeyPress = React.useCallback((e) => {
    addFabricKeyListener(fabricRef, e);
  }, []);

  const updateObjectSize = React.useCallback((e) => {
    alert(e.target)
    const oldWidth = fabricRef.current.width;
    const containerDim = containerRef.current.getBoundingClientRect();
    fabricRef.current.setHeight(containerDim.width * (595 / 842));
    fabricRef.current.setWidth(containerDim.width);
    fabricRef.current.discardActiveObject();
    var sel = new fabric.ActiveSelection(fabricRef.current.getObjects(), {
      canvas: fabricRef.current,
    });
    fabricRef.current.setActiveObject(sel);
    sel.scale(fabricRef.current.width / oldWidth);
    sel.left = (sel.left / oldWidth) * fabricRef.current.width;
    sel.top = (sel.top / oldWidth) * fabricRef.current.width;
    const { backgroundImage } = fabricRef.current;
    backgroundImage.scale(fabricRef.current.width / 842);
    backgroundImage.left =
      (backgroundImage.left / oldWidth) * fabricRef.current.width;
    backgroundImage.top =
      (backgroundImage.top / oldWidth) * fabricRef.current.width;
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
  }, []);

  React.useEffect(() => {
    fabric.devicePixelRatio = 2;
    Promise.all(['OldEnglish'].map((item) => new FontFaceObserver(item).load()))
      .then(() => renderCanvas())
      .catch(() => renderCanvas());
    window.addEventListener('resize', updateObjectSize);
    return () => {
      fabricRef.current.removeListeners();
      fabricRef.current = null;
      // clearInterval(intervalRender);
      window.removeEventListener('keydown', handleUserKeyPress);
      window.removeEventListener('resize', updateObjectSize);
    };
  }, []);

  const renderCanvas = React.useCallback(() => {
    const canvas = new fabric.Canvas('canvas', {
      objectCaching: false,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      fontSize: 20,
      centeredScaling: true,
      altActionKey: 'none',
      selectionKey: 'ctrlKey',
      allowTouchScrolling: true,
    });
    fabricRef.current = canvas;
    // load from JSON
    fabricRef.current.loadFromJSON(data, () => {
      const containerDim = containerRef.current.getBoundingClientRect();
      fabricRef.current.setHeight(containerDim.width * (595 / 842));
      fabricRef.current.setWidth(containerDim.width);
      fabricRef.current.discardActiveObject();
      var sel = new fabric.ActiveSelection(fabricRef.current.getObjects(), {
        canvas: fabricRef.current,
      });
      fabricRef.current.setActiveObject(sel);
      sel.scale(fabricRef.current.width / 842);
      sel.left = (sel.left / 842) * fabricRef.current.width;
      sel.top = (sel.top / 842) * fabricRef.current.width;
      const { backgroundImage } = fabricRef.current;
      backgroundImage.scale(fabricRef.current.width / 842);
      backgroundImage.left =
        (backgroundImage.left / 842) * fabricRef.current.width;
      backgroundImage.top =
        (backgroundImage.top / 842) * fabricRef.current.width;
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      // fabricRef.current.renderAll();
    });
    // fabricRef.current.historyInit()

    //fabric events
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('selection:created', (e) => {
      console.log('selection created', e.target);
      setSelectedObject(e.target);
      window.addEventListener('keydown', handleUserKeyPress);
    });
    if (!fabricRef.current) return;
    fabricRef.current.on('object:modified', (e) => {
      setSelectedObject(e.target);
      console.log('modified', e.target);
    });
    fabricRef.current.on('selection:updated', (e) => {
      console.log('selection:updated', e.target);
      setSelectedObject(e.target);
    });
    fabricRef.current.on('selection:cleared', (e) => {
      console.log('selection:cleared', e.target);
      setSelectedObject({});
      window.removeEventListener('keydown', handleUserKeyPress);
    });

    fabricRef.current.on('object:moving', function (options) {
      if (
        options.target.type === 'image' &&
        Math.round((options.target.left / 50) * 4) % 4 == 0 &&
        Math.round((options.target.top / 50) * 4) % 4 == 0
      ) {
        options.target
          .set({
            left: Math.round(options.target.left / 50) * 50,
            top: Math.round(options.target.top / 50) * 50,
          })
          .setCoords();
      }
    });
    // fabricRef.current.setHeight(595);
    // fabricRef.current.setWidth(842);

    fabricRef.current.renderAll();
    fabric.Object.prototype.set(fabricOptionsOveride);
  }, []);

  return (
    <Paper square elevation={3} ref={containerRef}>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </Paper>
  );
};

export default Canvas;
