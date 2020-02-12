import React, { useRef, useEffect, useState, useMemo } from 'react';
import { fabric } from 'fabric';
import pdfMake from 'pdfmake';
import './App.css';
import { readAndCompressImage } from 'browser-image-resizer';
import cloneDeep from 'clone-deep';
import jexcel from 'jexcel';
import ReactTooltip from 'react-tooltip';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaSortNumericUp,
  FaSortNumericDown,
} from 'react-icons/fa';
import { MdBorderVertical } from 'react-icons/md';
import {
  fabricOptionsOveride,
  fabricControlOptions,
  fabricTextOptions,
  fabricItextOptions,
  fabricTextboxOptions,
} from './config/fabric.config';
import { jexcelInstanceOptions } from './config/jexcel.config';
import Canvas from './components/Canvas';
import 'fabric-customise-controls';

import {
  preventOutsideMovement,
  preventOutsideScaling,
} from './utilty/canvass_helper.js';
import {
  centeredTextProperties,
  leftOrRightAlignedTextProperties,
  textboxMargin,
} from './utilty/pdf_helper';
import { toDataURL } from './utilty/helper';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function App() {
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const jexcelRef = useRef(null);
  const fabricRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const [count, setCount] = useState(16);

  useEffect(() => {
    jexcelRef.current = jexcel(divRef.current, jexcelInstanceOptions);
  }, []);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      objectCaching: false,
      preserveObjectStacking: true,
      fontSize: 20,
    });
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('selection:created', (e) => {
      if (e.target.fontSize) {
        setFontSize(parseInt(e.target.fontSize));
      }
    });

    fabricRef.current.on('object:scaling', preventOutsideScaling);
    fabricRef.current.setHeight(595);
    fabricRef.current.setWidth(842);
    fabricRef.current.renderAll();

    fabric.Object.prototype.set(fabricOptionsOveride);

    var text = new fabric.Text('Column 1', fabricTextOptions);
    var text2 = new fabric.Text('Column 2', fabricTextOptions);
    var text3 = new fabric.IText('m', fabricItextOptions);
    var t1 = new fabric.Textbox(
      'Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto.',
      fabricTextboxOptions
    );
    t1.setControlsVisibility(fabricControlOptions);

    fabric.Image.fromURL('/certificate2.jpg', function(img) {
      console.log(img);
      const image = fabricRef.current.setBackgroundImage(
        img,
        fabricRef.current.renderAll.bind(fabricRef.current),
        {
          scaleX: fabricRef.current.width / img.width,
          scaleY: fabricRef.current.height / img.height,
        }
      );
      console.log(img);
    });

    fabricRef.current.add(text3, text2, text, t1);
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
  }, []);

  const pageWidth = 842;
  const pageHeight = 695;
  const quality = 1;

  const generatePdf = async () => {
    const image = await toDataURL('/certificate2.jpg', {
      maxWidth: pageWidth,
      maxHeight: pageHeight,
      quality,
    });
    const pageBackground = {
      image: image,
      width: pageWidth,
      height: 595,
      absolutePosition: { x: 0, y: 0 },
    };

    const jsonCanvas = fabricRef.current.toObject();
    const headers = jexcelRef.current.getHeaders().split(',');
    const filteredData = jexcelRef.current.getData().filter((a) =>
      a.some(function(x) {
        return x;
      })
    );

    const singlePageObjects = [];
    const dynamicObjects = [];

    const { objects } = jsonCanvas;

    for (let i = 0; i < objects.length; i++) {
      if (objects[i].type === 'i-text') {
        singlePageObjects.push({
          text: objects[i].text,
          absolutePosition: {
            x: objects[i].left,
            y: objects[i].top - 2,
          },
          fontSize: objects[i].fontSize,
          alignment: objects[i].textAlign,
        });
      }
      if (objects[i].type === 'image') {
        singlePageObjects.push({
          image: objects[i].src,
          absolutePosition: {
            x: objects[i].left,
            y: objects[i].top - 2,
          },
          width: objects[i].width * objects[i].scaleX,
          height: objects[i].height * objects[i].scaleY,
        });
      }

      if (objects[i].type === 'textbox') {
        singlePageObjects.push({
          text: objects[i].text,
          relativePosition: {
            x: objects[i].left,
            y: objects[i].top - 2,
          },
          fontSize: objects[i].fontSize,
          alignment: objects[i].textAlign,
          margin: textboxMargin(objects[i].left, objects[i].width, 842),
        });
      }

      if (objects[i].type === 'text') {
        dynamicObjects.push({
          text: headers.indexOf(objects[i].text),
          ...(objects[i].textAlign === 'center'
            ? centeredTextProperties(objects[i], pageWidth)
            : leftOrRightAlignedTextProperties(objects[i], pageWidth)),
          fontSize: objects[i].fontSize,
        });
      }
    }

    let pagesContent = [];
    console.log(!filteredData.length || !dynamicObjects.length);
    if (!filteredData.length || !dynamicObjects.length) {
      pagesContent = [
        pageBackground,
        {
          stack: [...singlePageObjects],
          unbreakable: true,
        },
      ];
    } else {
      for (let i = 0; i < filteredData.length; i++) {
        pagesContent = [
          ...pagesContent,
          pageBackground,
          {
            stack: [
              ...singlePageObjects,
              ...loopThroughItems(dynamicObjects, filteredData[i]),
            ],
            unbreakable: true,
            ...(i !== filteredData.length - 1 && { pageBreak: 'after' }),
          },
        ];
      }
    }

    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      },
    };

    const docDefinition = cloneDeep({
      pageOrientation: 'landscape',
      pageMargins: 0,
      content: pagesContent,
    });

    // pdfMake.createPdf(docDefinition, null, null, vfs).open();
    pdfMake.createPdf(docDefinition).open();

    function loopThroughItems(dynamicObjects, rowData) {
      const arrayObj = [];
      for (let i = 0; i < dynamicObjects.length; i++) {
        arrayObj.push({
          ...dynamicObjects[i],
          text: rowData[dynamicObjects[i].text],
        });
      }
      console.log(arrayObj);
      return arrayObj;
    }
  };

  const alignCenter = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      activeEl.set({
        left: fabricRef.current.getWidth() / 2 - activeEl.width / 2,
      });
      activeEl.setCoords();
      fabricRef.current.requestRenderAll();
    }
  };

  const sendForward = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      fabricRef.current.bringForward(activeEl);
      fabricRef.current.requestRenderAll();
    }
  };

  const sendBackward = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      fabricRef.current.sendBackwards(activeEl);
      fabricRef.current.requestRenderAll();
    }
  };

  const onSetFontSize = (e) => {
    console.log(e.target.value);
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      activeEl.set('fontSize', e.target.value.toString());
      fabricRef.current.requestRenderAll();
    }
  };

  const onAlignText = (propertyValue, e) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      activeEl.set('textAlign', propertyValue);
      fabricRef.current.requestRenderAll();
    }
  };

  const onRemove = (e) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      fabricRef.current.remove(activeEl);
      // fabricRef.current.requestRenderAll();
    }
  };

  const onImageUpload = async (e) => {
    const config = {
      quality: 0.4,
      maxWidth: canvasRef.current.width / 2,
      maxHeight: canvasRef.current.height / 2,
      mimeType: e.target.files[0].type,
    };

    if (!e.target.files[0]) return;

    let inputforupload = await readAndCompressImage(e.target.files[0], config);

    const readerobj = new FileReader();

    readerobj.onload = function() {
      var imgElement = document.createElement('img');
      imgElement.src = readerobj.result;

      imgElement.onload = function() {
        var imageinstance = new fabric.Image(imgElement, {
          angle: 0,
          opacity: 1,
          cornerSize: 12,
          hasControls: true,
        });

        var cw = canvasRef.current.width;
        var ch = canvasRef.current.height;

        if (cw > ch) {
          imageinstance.scaleToWidth(canvasRef.current.width - 200);
          imageinstance.scaleToHeight(canvasRef.current.height - 200);
        } else {
          imageinstance.scaleToHeight(canvasRef.current.height - 200);
          imageinstance.scaleToWidth(canvasRef.current.width - 200);
        }
        fabricRef.current.add(imageinstance);
        fabricRef.current.centerObject(imageinstance);
      };
    };

    readerobj.readAsDataURL(inputforupload);
  };

  const logCanvas = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      console.log(activeEl.toObject());
      return;
    }
    console.log(fabricRef.current.toObject());
    // console.log(JSON.stringify( fabricRef.current));
  };

  const stateChange = () => {
    setCount(count + 1);
  };

  return (
    <div style={{ display: 'flex' }}>
      <ReactTooltip />
      <div>
        <Canvas ref={canvasRef} />
        <div>
          <button
            data-tip="Text Align Left"
            onClick={() => onAlignText('left')}
          >
            <FaAlignLeft />
          </button>
          <button
            data-tip="Text Align Center"
            onClick={() => onAlignText('center')}
          >
            <FaAlignCenter />
          </button>
          <button
            data-tip="Text Align Right"
            onClick={() => onAlignText('right')}
          >
            <FaAlignRight />
          </button>
        </div>
        <div>
          <button onClick={logCanvas}>LOG JSON</button>
          <button onClick={generatePdf}>download</button>
          <button data-tip="Center Horizontally" onClick={alignCenter}>
            <MdBorderVertical />
          </button>
          <button data-tip="Send Forward" onClick={sendForward}>
            <FaSortNumericUp />
          </button>
          <button data-tip="Send Backward" onClick={sendBackward}>
            <FaSortNumericDown />
          </button>
          <button onClick={stateChange}>state change</button>
          <button onClick={onRemove}>X</button>
        </div>

        <input
          type="file"
          id="file"
          onChange={onImageUpload}
          accept="image/*"
        />
        <input
          type="number"
          name="quantity"
          defaultValue={fontSize}
          key={fontSize}
          min="10"
          max="80"
          onChange={onSetFontSize}
        />
      </div>
      <div>
        <div ref={divRef}></div>
        <button
          onClick={() => {
            console.log(jexcelRef.current.getHeaders().split(','));
            console.log(jexcelRef.current.getData());
          }}
        >
          log data
        </button>
      </div>
    </div>
  );
}
