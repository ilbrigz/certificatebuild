import React from 'react';
import { fabric } from 'fabric';
import { AppContext } from '../context';
import FontFaceObserver from 'fontfaceobserver';

import {
  fabricOptionsOveride,
  fabricTextOptions,
} from '../config/fabric.config';

import 'fabric-customise-controls';
import { preventOutsideMovement } from '../utilty/canvass_helper.js';
const Canvas = () => {
  const { fabricRef, setSelectedObject, selectedObject } = React.useContext(
    AppContext
  );
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    var myfont = new FontFaceObserver('OldEnglish');
    myfont.load().then(() => {
      const canvas = new fabric.Canvas('canvas', {
        objectCaching: false,
        preserveObjectStacking: true,
        fontSize: 20,
        altActionKey: 'none',
        selectionKey: 'ctrlKey',
        allowTouchScrolling: true,
      });
      fabricRef.current = canvas;
      console.log(fabricRef);
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
      fabricRef.current.on('object:moving', function(options) {
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

      //insering some node
      var text = new fabric.Text('[[Column 1]]', fabricTextOptions);
      text.set({ fontWeight: 'bold' });
      text.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        bl: false,
        br: false,
        tl: true,
        tr: false,
        mt: false,
      });

      var text2 = new fabric.Text('[[Column 2]]', fabricTextOptions);
      fabric.Image.fromURL('/certificate2.jpg', function(img) {
        fabricRef.current.setBackgroundImage(
          img,
          fabricRef.current.renderAll.bind(fabricRef.current),
          {
            scaleX: fabricRef.current.width / img.width,
            scaleY: fabricRef.current.height / img.height,
          }
        );
      });

      fabricRef.current.add(text2, text);

      //fabric control cusomize
      fabric.Canvas.prototype.customiseControls({
        tl: {
          cursor: 'pointer',
          action: (e, target) => {
            console.log(target);
            fabricRef.current.remove(target);
            fabricRef.current.requestRenderAll();
          },
        },
      });

      fabric.Object.prototype.customiseCornerIcons(
        {
          settings: {
            cornerShape: 'circle',
            cornerBackgroundColor: 'orange',
          },
          tl: {
            icon: '/close.svg',
            settings: {
              cornerBackgroundColor: 'white',
            },
          },
        },
        function() {
          fabricRef.current.renderAll();
        }
      );

      // changing all the fonts

      let obj = fabricRef.current._objects.filter((o) => {
        return o.type === 'text' || o.type === 'textbox' || o.type === 'i-text';
      });
      obj.forEach(function(item, i) {
        item.set('fontFamily', 'OldEnglish');
      });

      fabricRef.current.requestRenderAll();
    });

    return () => {
      fabricRef.current.removeListeners();
      fabricRef.current.dispose();
      fabricRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas"></canvas>;
};
export default Canvas;
