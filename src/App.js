import React, { useRef, useEffect, useState, useMemo } from 'react';
import { fabric } from 'fabric';
import pdfMake from 'pdfmake';

import cloneDeep from 'clone-deep';
import jexcel from 'jexcel';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import FontFaceObserver from 'fontfaceobserver';

import {
  fabricOptionsOveride,
  fabricTextOptions,
  fabricTextboxOptions,
  fabricTextboxControlOptions,
} from './config/fabric.config';
import Controls from './components/Controls'
import { jexcelInstanceOptions } from './config/jexcel.config';
import Canvas from './components/Canvas';
import 'fabric-customise-controls';

import {
  preventOutsideMovement,
} from './utilty/canvass_helper.js';
import {
  centeredTextProperties,
  leftOrRightAlignedTextProperties,
  textboxMargin,
} from './utilty/pdf_helper';
import { toDataURL } from './utilty/helper';
import './App.css'

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function App() {
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  const jexcelRef = useRef(null);
  const fabricRef = useRef(null);
  const [controlsKey, setControlsKey] = useState(0)
  const [fontSize, setFontSize] = useState(16);
  const [count, setCount] = useState(16);

  useEffect(() => {
    var myfont = new FontFaceObserver('OldLondon');
    myfont.load().then(() => {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        objectCaching: false,
        preserveObjectStacking: true,
        fontSize: 20,
        altActionKey: 'none',
        selectionKey: 'ctrlKey',
        allowTouchScrolling: true,
      });
      fabricRef.current.on('object:moving', preventOutsideMovement);
      fabricRef.current.on('object:moving', function (options) {
        if (options.target.type === 'image' && Math.round(options.target.left / 50 * 4) % 4 == 0 &&
          Math.round(options.target.top / 50 * 4) % 4 == 0) {
          options.target.set({
            left: Math.round(options.target.left / 50) * 50,
            top: Math.round(options.target.top / 50) * 50
          }).setCoords();
        }
      });
      fabricRef.current.on('selection:created', (e) => {
        if (e.target.fontSize) {
          setFontSize(parseInt(e.target.fontSize));
        }
      });

      fabricRef.current.setHeight(595);
      fabricRef.current.setWidth(842);
      fabricRef.current.renderAll();

      fabric.Object.prototype.set(fabricOptionsOveride);

      var text = new fabric.Text('Column 1', fabricTextOptions);
      text.set({ fontWeight: 'bold', fontStyle: 'italic' })
      const styles = text.getSelectionStyles();
      console.log(styles)
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
      var text2 = new fabric.Text('Column 2', fabricTextOptions);
      var t1 = new fabric.Textbox(
        'Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto.',
        fabricTextboxOptions
      );
      t1.setControlsVisibility(fabricTextboxControlOptions);

      fabric.Image.fromURL('/certificate2.jpg', function (img) {
        console.log(img);
        const image = fabricRef.current.setBackgroundImage(
          img,
          fabricRef.current.renderAll.bind(fabricRef.current),
          {
            scaleX: fabricRef.current.width / img.width,
            scaleY: fabricRef.current.height / img.height,
          }
        );
      });

      fabricRef.current.add(text2, text, t1);
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
        function () {
          fabricRef.current.renderAll();
        }
      );
      let obj = fabricRef.current._objects.filter((o) => {
        return o.type === 'text' || o.type === 'textbox' || o.type === 'i-text'
      })
      obj.forEach(function (item, i) {
        item.set('fontFamily', 'OldLondon');
      });
      fabricRef.current.requestRenderAll();

      //#########JEXCEL############
      jexcelRef.current = jexcel(divRef.current, {
        ...jexcelInstanceOptions,
        onchangeheader: (a, b, c, d) => {
          onColumnNameChange(b, c, d)
        },
        oninsertcolumn: () => {
          onHeaderInsert()
        },
        onbeforedeletecolumn: (a, b, c, d, e) => {
          return onHeaderDelete(b)
        }
      })
      setControlsKey(Math.random())
    });
  }, []);

  const pageWidth = 842;
  const pageHeight = 695;
  const quality = 1;

  const onColumnNameChange = (index, prevText, newText) => {
    if (!newText) return;
    const headers = jexcelRef.current.getHeaders().split(",")
    const duplicates = headers.filter((i) => newText === i)
    if (duplicates.length > 1) {
      console.log(headers)
      alert('Column Name must be unique!');
      jexcelRef.current.setHeader(index, prevText);
      return;
    }
    console.log(headers)
    console.log(prevText)
    const objects = fabricRef.current.getObjects().filter((item) => item.type === 'text');
    const alreadyPresent = objects.filter(i => i.text === newText).length
    if (alreadyPresent) { return }
    const text = objects.find((i) => i.text === prevText);
    text.text = newText
    fabricRef.current.renderAll()
    text.setCoords()
  }
  const onHeaderInsert = () => {
    const objects = fabricRef.current.getObjects().filter((item) => item.type === 'text');
    const headers = jexcelRef.current.getHeaders().split(",")
    const newColumns = headers.filter((header) => !objects.find((object) => {
      return object.text === header
    }));
    newColumns.forEach(headerName => {
      const text = new fabric.Text(headerName, { ...fabricTextOptions, top: canvasRef.current.height / 5 * Math.random(), left: canvasRef.current.width / 5 * Math.random() });
      fabricRef.current.add(text)
    })
    fabricRef.current.renderAll();
  }

  const onHeaderDelete = (headerIndex) => {
    const headers = jexcelRef.current.getHeaders().split(",")
    const objects = fabricRef.current.getObjects().filter((item) => item.type === 'text');
    const objectToDelete = objects.find(i => i.text === headers[headerIndex])
    fabricRef.current.remove(objectToDelete);
    return true

  }

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
      a.some(function (x) {
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
          ...(objects[i].underline && { decoration: 'underline' }),
          ...(objects[i].fontStyle === 'italic' && { italics: true }),
          ...(objects[i].fontWeight === 'bold' && { bold: true }),
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
          ...(objects[i].underline && { decoration: 'underline' }),
          ...(objects[i].fontStyle === 'italic' && { italics: true }),
          ...(objects[i].fontWeight === 'bold' && { bold: true }),
          margin: textboxMargin(objects[i].left, objects[i].width, 842),
        });
      }

      if (objects[i].type === 'text') {
        dynamicObjects.push({
          text: headers.indexOf(objects[i].text),
          ...(objects[i].textAlign === 'center'
            ? centeredTextProperties(objects[i], pageWidth)
            : leftOrRightAlignedTextProperties(objects[i], pageWidth)),
          ...(objects[i].underline && { decoration: 'underline' }),
          ...(objects[i].fontStyle === 'italic' && { italics: true }),
          ...(objects[i].fontWeight === 'bold' && { bold: true }),
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
    var win = window.open('', '_blank')
    pdfMake.createPdf(docDefinition).open({}, win);

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


  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Canvas ref={canvasRef} />
        <Controls fontSize={fontSize}
          currentCanvas={() => canvasRef.current}
          currentFabric={() => fabricRef.current}
          generatePdf={generatePdf}
          key={controlsKey}
        />
      </div>
      <div>
        <div ref={divRef}></div>
        {/* <button
          onClick={() => {
            console.log(jexcel.getHeaders().split(','));
            console.log(jexcel.getData());
          }}
        >
          log data
        </button> */}
      </div>
    </div>
  );
}
