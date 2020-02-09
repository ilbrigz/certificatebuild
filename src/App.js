import React, { useRef, useEffect, useState, useMemo } from 'react';
import { fabric } from 'fabric';
import pdfMake from 'pdfmake';
import vfs from './vfs_fonts.js';
import './App.css';
import { readAndCompressImage } from 'browser-image-resizer';
import cloneDeep from 'clone-deep'


import Canvas from './components/Canvas'

import {
  preventOutsideMovement,
  preventOutsideScaling,
} from './utilty/canvass_helper.js';

import {
  centeredTextProperties, leftOrRightAlignedTextProperties, textboxMargin
} from './utilty/pdf_helper'

import { toDataURL } from './utilty/helper'



export default function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null)
  const [fontSize, setFontSize] = useState(16)
  const [count, setCount] = useState(16)

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      objectCaching: false,
      fontSize: 20,
    });
    fabricRef.current.on('object:moving', preventOutsideMovement);
    ;


    fabricRef.current.on('selection:created', (e) => {
      if (e.target.fontSize) {
        setFontSize(parseInt(e.target.fontSize))
      }
    })

    fabricRef.current.on('object:scaling', preventOutsideScaling);
    fabricRef.current.setHeight(595);
    fabricRef.current.setWidth(842);
    fabricRef.current.renderAll();

    console.log(fabric)

    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#00FFFF',
      cornerStrokeColor: 'red',
      borderColor: 'red',
      cornerSize: 12,
      padding: 0,
      cornerStyle: 'circle',
      borderDashArray: [3, 3],
      hasControls: false,
      hasRotatingPoint: false,
    });

    // console.log(canvas.forEachObject());

    var text = new fabric.Text('#name#', {
      left: 0,
      fontSize: 30,
      textAlign: 'center',
      hasRotatingPoint: false,
      top: 0,
      fontFamily: 'Roboto',
    });
    var text2 = new fabric.IText('m', {
      left: 0,
      top: 0,
      fontFamily: 'Roboto',
    });
    var text3 = new fabric.IText('m', {
      left: 100,
      top: 100,
      fontFamily: 'Roboto',
    });

    var t1 = new fabric.Textbox('Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto.', {
      width: 200,
      top: 400,
      hasControls: true,
      left: 200,
      fontSize: 16,
      padding: 0,
      textAlign: 'center',
      fontFamily: 'Roboto',
    });
    t1.setControlsVisibility({
      mt: false,
      mb: false,
      ml: true,
      mr: true,
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mtr: false,
    });

    fabric.Image.fromURL('/certificate2.jpg', function (img) {
      console.log(img)
      const image = fabricRef.current.setBackgroundImage(img, fabricRef.current.renderAll.bind(fabricRef.current), {
        scaleX: fabricRef.current.width / img.width,
        scaleY: fabricRef.current.height / img.height
      });
      console.log(img)
    });

    fabricRef.current.add(text3, text2, text, t1);
  }, []);

  const pageWidth = 842;
  const pageHeight = 695;
  const quality = 1;

  const generatePdf = async () => {
    const image = await toDataURL('http://localhost:3000/certificate2.jpg', { maxWidth: pageWidth, maxHeight: pageHeight, quality })
    const pageBackground = {
      image: image,
      width: pageWidth,
      height: 595,
      absolutePosition: { x: 0, y: 0 },
    };

    const jsonCanvas = fabricRef.current.toObject();

    const names = [
      {
        name:
          'Lor',
      },
      { name: 'john' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
      { name: 'rex' },
    ];

    const singlePageObjects = [];
    const dynamicObjects = [];
    const imageObjects = []

    for (let i = 0; i < jsonCanvas.objects.length; i++) {
      if (
        (jsonCanvas.objects[i].type === 'text' ||
          jsonCanvas.objects[i].type === 'i-text') &&
        jsonCanvas.objects[i].text !== '#name#'
      ) {
        singlePageObjects.push({
          text: jsonCanvas.objects[i].text,
          absolutePosition: {
            x: jsonCanvas.objects[i].left,
            y: jsonCanvas.objects[i].top - 2,
          },
          fontSize: jsonCanvas.objects[i].fontSize,
          alignment: jsonCanvas.objects[i].textAlign,
        });

      }
      if (
        jsonCanvas.objects[i].type === 'image'
        &&
        jsonCanvas.objects[i].text !== '#name#'
      ) {
        singlePageObjects.push({
          image: jsonCanvas.objects[i].src,
          absolutePosition: {
            x: jsonCanvas.objects[i].left,
            y: jsonCanvas.objects[i].top - 2,
          },
          width: jsonCanvas.objects[i].width * jsonCanvas.objects[i].scaleX,
          height: jsonCanvas.objects[i].height * jsonCanvas.objects[i].scaleY,
        });

      }

      if (jsonCanvas.objects[i].type === 'textbox' &&
        jsonCanvas.objects[i].text !== '#name#') {
        singlePageObjects.push({
          text: jsonCanvas.objects[i].text,
          relativePosition: {
            x: jsonCanvas.objects[i].left,
            y: jsonCanvas.objects[i].top - 2,
          },
          fontSize: jsonCanvas.objects[i].fontSize,
          alignment: jsonCanvas.objects[i].textAlign,
          margin: textboxMargin(jsonCanvas.objects[i].left,
            jsonCanvas.objects[i].width,
            842),

        });
      }

      if (
        jsonCanvas.objects[i].type === 'text' &&
        jsonCanvas.objects[i].text === '#name#'
      ) {
        dynamicObjects.push({
          text: jsonCanvas.objects[i].text,
          ...(jsonCanvas.objects[i].textAlign === 'center' ?
            centeredTextProperties(jsonCanvas.objects[i], pageWidth) :
            leftOrRightAlignedTextProperties(jsonCanvas.objects[i], pageWidth)),
          fontSize: jsonCanvas.objects[i].fontSize,

        });
      }
    }

    let pagesContent = [];

    for (let i = 0; i < names.length; i++) {
      pagesContent = [
        ...pagesContent,
        pageBackground,
        {
          stack: [
            ...singlePageObjects,
            { ...dynamicObjects[0], text: names[i].name },
          ],
          unbreakable: true,
          ...(i !== names.length - 1 && { pageBreak: 'after' }),
        },
      ];
    }

    const docDefinition = cloneDeep({
      pageOrientation: 'landscape',
      pageMargins: 0,
      content: pagesContent,
    })

    pdfMake.createPdf(docDefinition, null, null, vfs).open();
  };

  const alignCenter = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      activeEl.set({ left: fabricRef.current.getWidth() / 2 - activeEl.width / 2 });
      activeEl.setCoords();
      fabricRef.current.requestRenderAll();
    }
  };

  const sendForward = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      fabricRef.current.bringForward(activeEl)
      fabricRef.current.requestRenderAll();
    }
  }

  const sendBackward = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      fabricRef.current.sendBackwards(activeEl)
      fabricRef.current.requestRenderAll();
    }
  }

  const onSetFontSize = (e) => {
    console.log(e.target.value)
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      activeEl.set('fontSize', e.target.value.toString())
      fabricRef.current.requestRenderAll();
    }
  }

  const onAlignText = (propertyValue, e) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      activeEl.set('textAlign', propertyValue)
      fabricRef.current.requestRenderAll();
    }
  }

  const onRemove = (e) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      fabricRef.current.remove(activeEl)
      // fabricRef.current.requestRenderAll();
    }
  }

  const onImageUpload = async (e) => {

    const config = {
      quality: 0.4,
      maxWidth: canvasRef.current.width / 2,
      maxHeight: canvasRef.current.height / 2,
      mimeType: e.target.files[0].type
    };

    if (!e.target.files[0]) return;

    let inputforupload = await readAndCompressImage(e.target.files[0], config);

    const readerobj = new FileReader();

    readerobj.onload = function () {

      var imgElement = document.createElement('img');
      imgElement.src = readerobj.result;

      imgElement.onload = function () {

        var imageinstance = new fabric.Image(imgElement, {
          angle: 0,
          opacity: 1,
          cornerSize: 12,
          hasControls: true,
        });

        var cw = canvasRef.current.width;
        var ch = canvasRef.current.height;

        if (cw > ch) {
          /** canvas ist landscape **/
          imageinstance.scaleToWidth(canvasRef.current.width - 200);
          imageinstance.scaleToHeight(canvasRef.current.height - 200);

        } else {
          /** canvas ist portrait **/
          imageinstance.scaleToHeight(canvasRef.current.height - 200);
          imageinstance.scaleToWidth(canvasRef.current.width - 200);

        }


        // imageinstance.setControlsVisibility(HideControls);
        //imageinstance.cornerSize(40);
        //  imageinstance["cornerSize"] = parseFloat(40);
        // removes the right top control
        fabricRef.current.add(imageinstance);
        fabricRef.current.centerObject(imageinstance);
      };
    };

    readerobj.readAsDataURL(inputforupload);
  };

  const logCanvas = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      console.log(activeEl.toObject())
      return
    }
    console.log(fabricRef.current.toObject());
    // console.log(JSON.stringify( fabricRef.current));
  };

  const stateChange = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <p>{count}</p>
      <Canvas ref={canvasRef} />
      <div>
        <button onClick={() => onAlignText('left')}>Align left Text</button>
        <button onClick={() => onAlignText('center')}>align Center Text</button>
        <button onClick={() => onAlignText('right')}>Align right text</button>
      </div>
      <div>
        <button onClick={logCanvas}>LOG JSON</button>
        <button onClick={generatePdf}>download</button>
        <button onClick={alignCenter}>center of canvas</button>
        <button onClick={sendForward}>Send Forwrard</button>
        <button onClick={sendBackward}>Send sendBackwards</button>
        <button onClick={stateChange}>state change</button>
        <button onClick={onRemove}>X</button>
      </div>

      <input type="file" id="file" onChange={onImageUpload} accept="image/*" />
      <input type="number" name="quantity" defaultValue={fontSize} key={fontSize} min="10" max="80" onChange={onSetFontSize} />
    </div>
  );

}
