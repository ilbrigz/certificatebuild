import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';
import { Paper, makeStyles } from '@material-ui/core';
import { useGesture, useWheel } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring'

import { fabricOptionsOveride } from '../config/fabric.config';
import data from '../data/fabric';
import { addUndoRedo, addFabricKeyListener } from '../modules/fabric.module';

import { preventOutsideMovement } from '../utilty/canvass_helper.js';
const useStyles = makeStyles((theme) => ({
  canvasContainer: {
    backgroundColor: 'red',
    overflow: 'hidden',
    width: '100%',
    height: '80vh',
    position: 'relative',
    '&>div': {
      position: 'relative',
      width: 'auto',
      height: 'auto',
    },
  },
}));
const Canvas = () => {
  const outer = useWheel(state => console.log(state), { eventOptions: { captureEvents: false } })
  const [scale, setScale] = React.useState(1)
  const [translateX, setTranslateX] = React.useState(0)
  const [translateY, setTranslateY] = React.useState(0)
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const paperRef = React.useRef(null);
  const convasInnerContainer = React.useRef(null);
  const bind = useWheel(
    ({ event }) => {
      console.log('from inner')
      event.preventDefault()
      event.stopPropagation()
    }, { domTarget: convasInnerContainer, eventOptions: { passive: false } }
  )
  const classes = useStyles()
  const windowSizeRef = React.useRef();
  const { fabricRef, setSelectedObject, selectedObject } = React.useContext(
    AppContext
  );



  const [props, set, stop] = useSpring(
    () => ({
      transform: `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`,
      config: { duration: 100 },
      onRest() {
        zoomIt(fabricRef, scale)
      }
    })
  )
  set({ transform: `scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)` })

  React.useEffect(bind, [bind])


  const handleUserKeyPress = React.useCallback((e) => {
    addFabricKeyListener(fabricRef, e);
  }, []);

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
    fabricRef.current.setHeight(containerDim.width * (595 / 842));
    fabricRef.current.setWidth(containerDim.width);
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
      paperRef.current.style.height = `${containerDim.width * (595 / 842)}px`
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
    });
    //fabric events
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('selection:created', (e) => {
      setSelectedObject(e.target);
      window.addEventListener('keydown', handleUserKeyPress);
    });
    if (!fabricRef.current) return;
    fabricRef.current.on('object:modified', (e) => {
      setSelectedObject(e.target);
    });
    fabricRef.current.on('selection:updated', (e) => {
      setSelectedObject(e.target);
    });
    fabricRef.current.on('selection:cleared', (e) => {
      setSelectedObject({});
      window.removeEventListener('keydown', handleUserKeyPress);
    });

    canvas.on('mouse:down', (e) => {
      if (e.target !== null) {
        // e.stopPropagation();
        //Ignore this event, we are clicking on an object (event.target is clicked object)
        return;
      }
      // e.stopPropagation();
      // e.preventDefault();
    })

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
    <>
      <Paper square
        {...outer()}
        ref={paperRef}
        className={classes.canvasContainer} elevation={3} >
        <animated.div style={props} ref={convasInnerContainer} ref={containerRef}>
          <canvas ref={canvasRef} id="canvas"></canvas>
        </animated.div>
      </Paper>
      <button onClick={() => {  // Update spring with new props
        setScale(scale + .1)
        // updateObjectSize()
        // Stop animation
        // stop()
      }}>scale up</button>
      <button onClick={() => {  // Update spring with new props
        setScale(scale - .1)
        // updateObjectSize()
      }}>scale down</button>
      <button onClick={() => {  // Update spring with new props
        setTranslateX(translateX + 16)
      }}>move left</button>
      <button onClick={() => {  // Update spring with new props
        setTranslateX(translateX - 16)
      }}>move right</button>
      <button onClick={() => {  // Update spring with new props
        setTranslateY(translateY + 16)
      }}>move up</button>
      <button onClick={() => {  // Update spring with new props
        setTranslateY(translateY - 16)
      }}>move down</button>
      <button onClick={() => {  // Update spring with new props

        setTranslateY(0)
        setTranslateX(0)
        setScale(1)
      }}>reset</button>
    </>
  );
};

export default Canvas;

function zoomIt(canvasRef, factor) {
  canvasRef.current.setHeight(canvasRef.current.getHeight() * factor);
  canvasRef.current.setWidth(canvasRef.current.getWidth() * factor);
  if (canvasRef.current.backgroundImage) {
    // Need to scale background images as well
    var bi = canvasRef.current.backgroundImage;
    bi.width = bi.width * factor; bi.height = bi.height * factor;
  }
  var objects = canvasRef.current.getObjects();
  for (var i in objects) {
    var scaleX = objects[i].scaleX;
    var scaleY = objects[i].scaleY;
    var left = objects[i].left;
    var top = objects[i].top;

    var tempScaleX = scaleX * factor;
    var tempScaleY = scaleY * factor;
    var tempLeft = left * factor;
    var tempTop = top * factor;

    objects[i].scaleX = tempScaleX;
    objects[i].scaleY = tempScaleY;
    objects[i].left = tempLeft;
    objects[i].top = tempTop;

    objects[i].setCoords();
  }
  canvasRef.current.renderAll();
  canvasRef.current.calcOffset();
}