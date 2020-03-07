import pdfMake from 'pdfmake';
import cloneDeep from 'clone-deep';
import {
  centeredTextProperties,
  leftOrRightAlignedTextProperties,
  textboxMargin,
} from '../utilty/pdf_helper';

import { toDataURL } from '../utilty/helper';
import { PdfAssetsLoader } from 'pdfmake-utils'
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

const assetsLoader = new PdfAssetsLoader()

// all possible standard fonts
assetsLoader.registerFont({ name: 'Times', fileName: 'Times-Roman', styles: ['normal'] })
assetsLoader.registerFont({ name: 'Times', fileName: 'Times-Italic', styles: ['italics'] })
assetsLoader.registerFont({ name: 'Times', fileName: 'Times-Bold', styles: ['bold'] })
assetsLoader.registerFont({ name: 'Times', fileName: 'Times-BoldItalic', styles: ['bolditalics'] })

assetsLoader.registerFont({ name: 'OldEnglish', fileName: 'OLD.ttf', styles: ['normal'] })
assetsLoader.registerFont({ name: 'OldEnglish', fileName: 'OldEnglishTextMT-Oblique.ttf', styles: ['italics'] })
assetsLoader.registerFont({ name: 'OldEnglish', fileName: 'OldEnglishTextMT-Bold.ttf', styles: ['bold'] })
assetsLoader.registerFont({ name: 'OldEnglish', fileName: 'OldEnglishTextMT-BoldOblique.ttf', styles: ['bolditalics'] })

assetsLoader.registerFont({ name: 'Courier', fileName: 'Courier', styles: ['normal'] })
assetsLoader.registerFont({ name: 'Courier', fileName: 'Courier-Oblique', styles: ['italics'] })
assetsLoader.registerFont({ name: 'Courier', fileName: 'Courier-Bold', styles: ['bold'] })
assetsLoader.registerFont({ name: 'Courier', fileName: 'Courier-BoldOblique', styles: ['bolditalics'] })

assetsLoader.registerFont({ name: 'Helvetica', fileName: 'Helvetica', styles: ['normal'] })
assetsLoader.registerFont({ name: 'Helvetica', fileName: 'Helvetica-Oblique', styles: ['italics'] })
assetsLoader.registerFont({ name: 'Helvetica', fileName: 'Helvetica-Bold', styles: ['bold'] })
assetsLoader.registerFont({ name: 'Helvetica', fileName: 'Helvetica-BoldOblique', styles: ['bolditalics'] })


assetsLoader.load().then(() => {
  assetsLoader.configurePdfMake(pdfMake)
  console.log('fonts loaded')
}).catch(errors => {
  // will fail if one of the files fails to load 
  // configure pdfMake with the files that loaded correctly
  assetsLoader.configurePdfMake(pdfMake)
  console.error('assets loading', errors);
})





export const generatePdf = async ({ fabricRef, jexcelRef }) => {


  const image = await toDataURL('/certificate2.jpg', {
    maxWidth: fabricRef.current.width,
    maxHeight: fabricRef.current.height,
    quality: 1,
  });
  // const pageBackground = {
  //   image: image,
  //   width: fabricRef.current.width,
  //   height: 595,
  //   absolutePosition: { x: 0, y: 0 },
  // };
  const pageBackground = {
    svg: `<svg>
    <rect y="2" x="2" width="${fabricRef.current.width -
      2 * 24}" height="${fabricRef.current.height - 2 * 24}"
    style="fill:white;stroke:black;stroke-width:5;fill-opacity:1;stroke-opacity:0.9" />
  </svg>`,
    absolutePosition: { x: 22, y: 22 },
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
        font: objects[i].fontFamily,
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
        color: objects[i].fill,
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
        font: objects[i].fontFamily,
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
        color: objects[i].fill,
      });
    }

    if (objects[i].type === 'text') {
      dynamicObjects.push({
        font: objects[i].fontFamily,
        text: headers.indexOf(
          objects[i].text.substring(2, objects[i].text.length - 2)
        ),
        ...(objects[i].textAlign === 'center'
          ? centeredTextProperties(objects[i], fabricRef.current.width)
          : leftOrRightAlignedTextProperties(
            objects[i],
            fabricRef.current.width
          )),
        ...(objects[i].underline && { decoration: 'underline' }),
        ...(objects[i].fontStyle === 'italic' && { italics: true }),
        ...(objects[i].fontWeight === 'bold' && { bold: true }),
        fontSize: objects[i].fontSize,
        color: objects[i].fill,
      });
    }
  }

  let pagesContent = [];
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

  const docDefinition = cloneDeep({
    pageOrientation: 'landscape',
    pageMargins: 0,
    content: pagesContent,
  });

  // pdfMake.createPdf(docDefinition, null, null, vfs).open();
  var win = window.open('', '_blank');
  pdfMake.createPdf(docDefinition).open({}, win);

  function loopThroughItems(dynamicObjects, rowData) {
    const arrayObj = [];
    for (let i = 0; i < dynamicObjects.length; i++) {
      arrayObj.push({
        ...dynamicObjects[i],
        text: rowData[dynamicObjects[i].text],
      });
    }
    return arrayObj;
  }
};

export const generatePdfUsingSvg = async ({ fabricRef, jexcelRef }) => {
  const screenShot = fabricRef.current.toObject()

  let obj = fabricRef.current._objects.filter((o) => {
    return o.type === 'text';
  });
  const headers = jexcelRef.current.getHeaders().split(',');
  const filteredData = jexcelRef.current.getData().filter((a) =>
    a.some(function (x) {
      return x;
    })
  );
  const mapping = [];
  obj.forEach((i) => mapping.push(i.text.substring(2, i.text.length - 2)));

  const pdfContents = [];
  filteredData.forEach((data, idx) => {
    obj.forEach((i, idx) => {
      const { left, width } = i
      i.text = data[headers.indexOf(mapping[idx])] + '';
      fabricRef.current.renderAll();
      console.log(width, i.width)
      if (i.textAlign === 'center') i.left = left + width / 2 - i.width / 2
      if (i.textAlign === 'right') i.left = left + width - i.width
      fabricRef.current.renderAll();
    });
    pdfContents.push({
      svg: fabricRef.current
        .toSVG({ suppressPreamble: true })
        .replace(/underline\s/g, 'underline'),
      absolutePosition: {
        x: 0,
        y: -2,
      },
      ...(idx !== filteredData.length - 1 && { pageBreak: 'after' }),
    });
  });

  const docDefinition = cloneDeep({
    pageOrientation: 'landscape',
    pageMargins: 0,
    content: pdfContents,
  });

  // pdfMake.createPdf(docDefinition, null, null, vfs).open();
  var win = window.open('', '_blank');
  pdfMake.createPdf(docDefinition).open({}, win);
  fabricRef.current.loadFromJSON(screenShot)
  // obj.forEach((i, idx) => {
  //   i.text = '[[' + mapping[idx] + ']]';
  //   fabricRef.current.requestRenderAll();
  // });
};

export const addFabricKeyListener = (fabricRef, e) => {
  const { key, keyCode } = e;
  const activeEl = fabricRef.current.getActiveObject();
  console.log(key);
  switch (key) {
    case 'Escape':
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      break;
    case 'ArrowUp':
      if (activeEl.top < 1) {
        return;
      }
      activeEl.top = activeEl.top - 2;
      e.preventDefault();
      activeEl.setCoords();
      fabricRef.current.renderAll();
      break;
    case 'ArrowRight':
      if (activeEl.left + activeEl.width > fabricRef.current.width) {
        return;
      }
      e.preventDefault();
      activeEl.left = activeEl.left + 2;
      activeEl.setCoords();
      fabricRef.current.renderAll();
      break;
    case 'ArrowDown':
      if (activeEl.top + activeEl.height > fabricRef.current.height) {
        return;
      }
      e.preventDefault();
      activeEl.top = activeEl.top + 2;
      activeEl.setCoords();
      fabricRef.current.renderAll();
      break;
    case 'ArrowLeft':
      if (activeEl.left < 1) {
        return;
      }
      e.preventDefault();
      activeEl.left = activeEl.left - 2;
      activeEl.setCoords();
      fabricRef.current.renderAll();
      break;
    default:
      console.log(keyCode);
  }

  if (keyCode >= 65 && keyCode <= 90) {
  }
}