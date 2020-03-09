import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';

import {
  fabricOptionsOveride,
} from '../config/fabric.config';
import data from '../data/fabric';
import { addUndoRedo, addFabricKeyListener } from '../modules/fabric.module'

import { preventOutsideMovement } from '../utilty/canvass_helper.js';
console.log(data);
const Canvas = () => {
  const { fabricRef, setSelectedObject, selectedObject } = React.useContext(
    AppContext
  );
  const canvasRef = React.useRef(null);

  const handleUserKeyPress = React.useCallback((e) => {
    addFabricKeyListener(fabricRef, e)
  }, []);

  React.useEffect(() => {
    Promise.all(
      ['OldEnglish'].map(item => new FontFaceObserver(item).load())
    ).then(
      () => renderCanvas()
    ).catch(
      () => renderCanvas()
    )

    return () => {
      fabricRef.current.removeListeners();
      fabricRef.current.dispose();
      fabricRef.current = null;
      // clearInterval(intervalRender);
      window.removeEventListener('keydown', handleUserKeyPress);
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
      fabricRef.current.discardActiveObject();
      var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: fabricRef.current,
      });
      fabricRef.current.setActiveObject(sel);
      // if (sel) fabricRef.current.centerObjectH(sel);
      // if (sel) fabricRef.current.centerObjectV(sel);
      sel.scale(fabricRef.current.width / 842)
      sel.left = sel.left / 842 * fabricRef.current.width
      sel.top = sel.top / 842 * fabricRef.current.width
      const { backgroundImage } = fabricRef.current
      backgroundImage.scale(fabricRef.current.width / 842)
      backgroundImage.left = backgroundImage.left / 842 * fabricRef.current.width
      backgroundImage.top = backgroundImage.top / 842 * fabricRef.current.width
      fabricRef.current.discardActiveObject()
      fabricRef.current.requestRenderAll();
    });
    // fabricRef.current.historyInit()

    //fabric events
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('selection:created', (e) => {
      console.log('selection created', e.target)
      setSelectedObject(e.target);
      window.addEventListener('keydown', handleUserKeyPress);
    });
    if (!fabricRef.current) return;
    fabricRef.current.on('object:modified', (e) => {
      setSelectedObject(e.target);
      console.log('modified', e.target)
    });
    fabricRef.current.on('selection:updated', (e) => {
      console.log('selection:updated', e.target)
      setSelectedObject(e.target);
    });
    fabricRef.current.on('selection:cleared', (e) => {
      console.log('selection:cleared', e.target)
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
    fabricRef.current.setHeight(1190);
    // fabricRef.current.setWidth(842);
    fabricRef.current.setWidth(1684);

    fabricRef.current.renderAll();
    fabric.Object.prototype.set(fabricOptionsOveride);

  }, [])

  return (
    <>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </>
  );
};

export default Canvas;
