import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';

import {
  fabricOptionsOveride,
} from '../config/fabric.config';
import data from '../data/fabric';
import { addFabricKeyListener } from '../modules/pdfmake.module'

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
    fabricRef.current.loadFromJSON(data);


    //fabric events
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('selection:created', (e) => {
      setSelectedObject(e.target);
      window.addEventListener('keydown', handleUserKeyPress);
    });
    if (!fabricRef.current) return;
    fabricRef.current.on('selection:created', (e) => {
      setSelectedObject(e.target);
    });
    fabricRef.current.on('selection:updated', (e) => {
      setSelectedObject(e.target);
    });
    fabricRef.current.on('selection:cleared', () => {
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
    fabricRef.current.setHeight(595);
    fabricRef.current.setWidth(842);
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
