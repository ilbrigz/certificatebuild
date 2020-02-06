import React, { useRef, useEffect } from "react";
import { fabric } from "fabric";
import jsPDF from 'jspdf'
import pdfMake from 'pdfmake'
import vfs from './vfs_fonts.js'
import "./App.css"

function centerText(x, length, pageLength) {
  const centerOfFabricText = x + length / 2;
  if (centerOfFabricText > pageLength / 2) {
    return centerOfFabricText - (pageLength - centerOfFabricText)
  } else { return 0 }
}

function checkMargin(x, length, pageLength) {
  const centerOfFabricText = x + length / 2;
  if (centerOfFabricText < pageLength / 2) {
    const rightMargin = pageLength - (2 * centerOfFabricText)
    return [0, 0, rightMargin, 0]
  } else { return [0, 0, 0, 0] }
}



function getBase64ImageFromURL(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = url;
  });
}


export default function App() {
  const canvasRef = useRef(null);
  let canvas = undefined;

  useEffect(() => {



    canvas = new fabric.Canvas(canvasRef.current, {
      objectCaching: false,
      fontSize: 20
    });
    canvas.on('object:moving', function (e) {
      var obj = e.target;
      // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
      }
      obj.setCoords();
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
      }
    });

    var left1 = 0;
    var top1 = 0;
    var scale1x = 0;
    var scale1y = 0;
    var width1 = 0;
    var height1 = 0;
    canvas.on('object:scaling', function (e) {
      var obj = e.target;
      obj.setCoords();
      var brNew = obj.getBoundingRect();

      if (((brNew.width + brNew.left) >= obj.canvas.width) || ((brNew.height + brNew.top) >= obj.canvas.height) || ((brNew.left < 0) || (brNew.top < 0))) {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
      }
      else {
        left1 = obj.left;
        top1 = obj.top;
        scale1x = obj.scaleX;
        scale1y = obj.scaleY;
        width1 = obj.width;
        height1 = obj.height;
      }
    });
    canvas.setHeight(595);
    canvas.setWidth(842);
    canvas.renderAll();

    // fabric.Image.fromURL('logo512.png', function (img) {
    //   canvas.add(img)
    // })
    var text = new fabric.Text('#name#', { left: 0, top: 0, fontFamily: 'Roboto' });
    var text2 = new fabric.Text('m', { left: 0, top: 0, fontFamily: 'Roboto' });
    var text3 = new fabric.Text('m', { left: 100, top: 100, fontFamily: 'Roboto' });
    canvas.add(text, text2, text3);


  })

  const pageWidth = 842

  const generatePdf = async () => {
    const pageBackground = {
      image: await getBase64ImageFromURL('https://picsum.photos/200/300'),
      width: pageWidth,
      height: 595,
      absolutePosition: { x: 0, y: 0 }
    }



    const jsonCanvas = JSON.parse(JSON.stringify(canvas))


    const names = [{ name: 'brayn Lollitia? Aperiam, quam velit ab quia illo nam exercitationem! Et, deleniti magni.' }, { name: 'john' }, { name: 'rex' }]

    const singlePageObjects = [];
    const dynamicObjects = [];

    for (let i = 0; i < jsonCanvas.objects.length; i++) {
      if (jsonCanvas.objects[i].type === 'text' && jsonCanvas.objects[i].text !== "#name#") {
        singlePageObjects.push({
          text: jsonCanvas.objects[i].text,
          absolutePosition: { x: jsonCanvas.objects[i].left, y: jsonCanvas.objects[i].top - 2 },
          fontSize: jsonCanvas.objects[i].fontSize,
        })
      }

      if (jsonCanvas.objects[i].type === 'text' && jsonCanvas.objects[i].text === "#name#") {
        dynamicObjects.push({
          text: jsonCanvas.objects[i].text,
          ...(jsonCanvas.objects[i].left + jsonCanvas.objects[i].width / 2 > pageWidth / 2 ? { absolutePosition: { x: centerText(jsonCanvas.objects[i].left, jsonCanvas.objects[i].width, 842), y: jsonCanvas.objects[i].top - 2 } } :
            {
              relativePosition: { x: centerText(jsonCanvas.objects[i].left, jsonCanvas.objects[i].width, 842), y: jsonCanvas.objects[i].top - 2 },
              margin: checkMargin(jsonCanvas.objects[i].left, jsonCanvas.objects[i].width, 842),
            }),
          fontSize: jsonCanvas.objects[i].fontSize,
          style: { alignment: 'center' },
        })
      }

    }

    let pagesContent = [];

    for (let i = 0; i < names.length; i++) {
      pagesContent = [...pagesContent, pageBackground, { stack: [...singlePageObjects, { ...dynamicObjects[0], text: names[i].name }], unbreakable: true, ...(i !== names.length - 1 && { pageBreak: 'after' }) }];
    }

    const docDefinition = JSON.parse(JSON.stringify({
      pageOrientation: 'landscape',
      pageMargins: 0,
      content: pagesContent,
    }))


    pdfMake.createPdf(docDefinition, null, null, vfs).download()
  }

  const logCanvas = () => {
    console.log(JSON.parse(JSON.stringify(canvas)))

  }
  const pdfTest = () => {
    var doc = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [4, 2]
    })

    doc.text('Hello world!', 1, 1)
    doc.save('two-by-four.pdf')
  }

  return (
    <div>
      <p>test</p>
      <canvas ref={canvasRef} style={{ border: "1px solid red" }}></canvas>
      <button onClick={logCanvas}>LOG JSON</button>
      <button onClick={generatePdf}>download</button>
      <button onClick={pdfTest}>Try jsPDF</button>
    </div>
  );
}
