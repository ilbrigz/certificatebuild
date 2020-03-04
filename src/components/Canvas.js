import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';

import {
  fabricOptionsOveride,
  fabricTextOptions, fabricTextboxControlOptions, fabricTextboxOptions
} from '../config/fabric.config';
import data from '../data/fabric'

import { preventOutsideMovement } from '../utilty/canvass_helper.js';
console.log(data)
const Canvas = () => {
  const { fabricRef, setSelectedObject, selectedObject } = React.useContext(
    AppContext
  );
  const canvasRef = React.useRef(null);
  React.useEffect(() => {

    const canvas = new fabric.Canvas('canvas', {
      objectCaching: false,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      fontSize: 20,
      altActionKey: 'none',
      selectionKey: 'ctrlKey',
      allowTouchScrolling: true,
    });
    fabricRef.current = canvas;
    fabricRef.current.loadFromJSON(data)
    //fabric events
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('selection:created', (e) => {
      setSelectedObject(e.target);
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
    });

    fabricRef.current.on('object:scaling', function onObjectScaled(e) {
      var scaledObject = e.target;
      if (scaledObject.flipX === true || scaledObject.flipY === true) {
        scaledObject.flipX = false;
        scaledObject.flipY = false;
      }
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

    //testing
    fabric.loadSVGFromString(`<svg>
      <rect width="${fabricRef.current.width - 2 * 24}" height="${fabricRef.current.height - 2 * 24}"
      style="fill:white;stroke:black;stroke-width:5;fill-opacity:1;stroke-opacity:0.9" />
    </svg>`, function (objects, options) {
      var obj = fabric.util.groupSVGElements(objects, options);
      fabricRef.current.setBackgroundImage(
        obj,
        fabricRef.current.renderAll.bind(fabricRef.current),
        {
          top: 24 - 2,
          left: 24 - 2
        }
      );
    });


    // changing all the fonts

    let obj = fabricRef.current._objects.filter((o) => {
      return o.type === 'text' || o.type === 'textbox' || o.type === 'i-text';
    });
    console.log(obj)
    obj.forEach(function (item, i) {
      var myfont = new FontFaceObserver(item.fontFamily, { weight: item.fontWeight, style: item.fontStyle })
      myfont.load().then(() => {
        item.set('fontFamily', item.fontFamily);
        if (item.type === 'textbox') {
          item.setControlsVisibility({
            mb: false,
            ml: true,
            mr: true,
            tl: false,
            bl: false,
            br: false,
            tr: false,
            mt: false,
            mtr: false //the rotating point (defaut: true)
          });
        }
        item._forceClearCache = true;
        fabricRef.current.renderAll();
      });


    });
    return () => {
      fabricRef.current.removeListeners();
      fabricRef.current.dispose();
      fabricRef.current = null;
    };
  }, []);

  return (<>
    <canvas ref={canvasRef} id="canvas"></canvas></>);
};

export default Canvas;
