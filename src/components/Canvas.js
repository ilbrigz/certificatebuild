import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';
import { Paper, makeStyles } from '@material-ui/core';

import { fabricOptionsOveride } from '../config/fabric.config';
import data from '../data/fabric';
import { addUndoRedo, addCanvasLister, eventCleanUp } from '../modules/fabric.module';
import initAligningGuidelines from '../modules/aligningLines'
const useStyles = makeStyles((theme) => ({
  canvasContainer: {
    backgroundColor: 'red',
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
    '&  div': {
      position: 'relative',
      width: 'auto',
      height: 'auto',
      overflow: 'hidden'
    },
  },
}));
const Canvas = () => {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const paperRef = React.useRef(null);
  const convasInnerContainer = React.useRef(null);

  const classes = useStyles()
  const windowSizeRef = React.useRef();
  const { fabricRef, setSelectedObject, selectedObject } = React.useContext(
    AppContext
  );

  const updateObjectSize = React.useCallback((e) => {
    //check the updated width
    var width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    //if the width are the same it means the resize is caused by the
    //android keyboard
    //do nothing
    if (width === windowSizeRef.current) { return }
    const oldWidth = fabricRef.current.width;
    const containerDim = containerRef.current.getBoundingClientRect();
    fabricRef.current.setWidth(containerDim.width);
    fabricRef.current.setHeight(containerDim.width * (595 / 842));
    fabricRef.current.discardActiveObject();
    var sel = new fabric.ActiveSelection(fabricRef.current.getObjects(), {
      canvas: fabricRef.current,
    });
    fabricRef.current.setActiveObject(sel);
    console.log(fabricRef.current.width, oldWidth)

    sel.scale(fabricRef.current.width / oldWidth);
    sel.left = (sel.left / oldWidth) * fabricRef.current.width;
    sel.top = (sel.top / oldWidth) * fabricRef.current.width;
    const { backgroundImage } = fabricRef.current;
    backgroundImage.scale(fabricRef.current.width / 842);
    backgroundImage.left =
      (backgroundImage.left / oldWidth) * fabricRef.current.width;
    backgroundImage.top =
      (backgroundImage.top / oldWidth) * fabricRef.current.width;
    paperRef.current.style.height = `${containerDim.width * (595 / 842)}px`
    fabricRef.current.discardActiveObject();
    fabricRef.current.renderAll();
    //update the windowSizeRef for future reference
    windowSizeRef.current = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth
  }, []);



  React.useEffect(() => {
    // fix pixelated text
    fabric.devicePixelRatio = 2;
    windowSizeRef.current = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    Promise.all(['OldEnglish'].map((item) => new FontFaceObserver(item).load()))
      .then(() => renderCanvas())
      .catch(() => renderCanvas());
    window.addEventListener('resize', updateObjectSize);

    return () => {
      fabricRef.current.removeListeners();
      fabricRef.current = null;
      // clearInterval(intervalRender);
      eventCleanUp()
      window.removeEventListener('resize', updateObjectSize);
    };
  }, []);

  const renderCanvas = React.useCallback(() => {
    const canvas = new fabric.Canvas('canvas', {
      // objectCaching: false,
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
      fabricRef.current.setWidth(containerDim.width);
      fabricRef.current.setHeight(containerDim.width * (595 / 842));
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
      paperRef.current.style.height = `${containerDim.width * (595 / 842)}px`
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
    });
    //add all canvas listeners
    addCanvasLister({ selectedObject, setSelectedObject, fabricRef })
    // fabricRef.current.setHeight(595);
    // fabricRef.current.setWidth(842);
    initAligningGuidelines(fabricRef.current)

    fabricRef.current.renderAll();
    fabric.Object.prototype.set(fabricOptionsOveride);
  }, []);

  return (
    <>
      <Paper square
        ref={paperRef}
        className={classes.canvasContainer} elevation={3} >
        <div ref={convasInnerContainer} ref={containerRef}>
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
      </Paper>
      <button onClick={() => {  // Update spring with new props
        fabricRef.current.zoomToPoint(new fabric.Point(fabricRef.current.width / 2, fabricRef.current.height / 2), fabricRef.current.getZoom() / .9);
      }}>scale up</button>
      <button onClick={() => {  // Update spring with new props
        console.log(fabricRef.current.getZoom())
        fabricRef.current.zoomToPoint(new fabric.Point(fabricRef.current.width / 2, fabricRef.current.height / 2), fabricRef.current.getZoom() * .9);
        // updateObjectSize()
      }}>scale down</button>
      <button onClick={() => {  // Update spring with new props
        var units = 10;
        var delta = new fabric.Point(units, 0);
        fabricRef.current.relativePan(delta);
      }}>move left</button>
      <button onClick={() => {  // Update spring with new props
        //update spring with new props
        var units = 10;
        var delta = new fabric.Point(-units, 0);
        fabricRef.current.relativePan(delta);

      }}>move right</button>
      <button onClick={() => {  // Update spring with new props

        var units = 10;
        var delta = new fabric.Point(0, units);
        fabricRef.current.relativePan(delta);

      }}>move up</button>
      <button onClick={() => {  // Update spring with new props
        var units = 10;
        var delta = new fabric.Point(0, -units);
        fabricRef.current.relativePan(delta);
      }}>move down</button>

      <button onClick={() => {  // Update spring with new props
        fabricRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);
      }}>reset zoom</button>
    </>
  );
};

export default Canvas;