import pdfMake from 'pdfmake';
import cloneDeep from 'clone-deep';
import vfsFonts from '../vfs_fonts';
import RobotoFonts from 'pdfmake/build/vfs_fonts';
import {
  centeredTextProperties,
  leftOrRightAlignedTextProperties,
  textboxMargin,
} from '../utilty/pdf_helper';

import { toDataURL } from '../utilty/helper';

const customFont = { ...vfsFonts.pdfMake.vfs, ...RobotoFonts.pdfMake.vfs };
const generatePdf = async ({ fabricRef, jexcelRef }) => {
  pdfMake.vfs = customFont;
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf',
    },
    OldEnglish: {
      normal: 'Old_English_Regular.ttf',
      bold: 'Old_English_Bold.ttf',
      italics: 'Old_English_Italic_Italic.ttf',
      bolditalics: 'Old_English_Bold_Italic.ttf',
    },
  };

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
    svg: ` <svg>
    <rect x="50" y="20" width="550" height="550"
    style="fill:white;stroke:black;stroke-width:5;stroke-opacity:1" />
  </svg>`,
    width: fabricRef.current.width,
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
        // font: 'OldEnglish',
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
  console.log(dynamicObjects, '$$$$$$$$$$$$');

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
    console.log(arrayObj);
    return arrayObj;
  }
};

export default generatePdf;
