import pdfMake from 'pdfmake';
import cloneDeep from 'clone-deep';

import { PdfAssetsLoader } from 'pdfmake-utils';
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

const assetsLoader = new PdfAssetsLoader();

// all possible standard fonts
assetsLoader.registerFont({
  name: 'Times',
  fileName: 'Times-Roman',
  styles: ['normal'],
});
assetsLoader.registerFont({
  name: 'Times',
  fileName: 'Times-Italic',
  styles: ['italics'],
});
assetsLoader.registerFont({
  name: 'Times',
  fileName: 'Times-Bold',
  styles: ['bold'],
});
assetsLoader.registerFont({
  name: 'Times',
  fileName: 'Times-BoldItalic',
  styles: ['bolditalics'],
});

assetsLoader.registerFont({
  name: 'OldEnglish',
  fileName: 'OLD.ttf',
  styles: ['normal'],
});
assetsLoader.registerFont({
  name: 'OldEnglish',
  fileName: 'OldEnglishTextMT-Oblique.ttf',
  styles: ['italics'],
});
assetsLoader.registerFont({
  name: 'OldEnglish',
  fileName: 'OldEnglishTextMT-Bold.ttf',
  styles: ['bold'],
});
assetsLoader.registerFont({
  name: 'OldEnglish',
  fileName: 'OldEnglishTextMT-BoldOblique.ttf',
  styles: ['bolditalics'],
});

assetsLoader.registerFont({
  name: 'Courier',
  fileName: 'Courier',
  styles: ['normal'],
});
assetsLoader.registerFont({
  name: 'Courier',
  fileName: 'Courier-Oblique',
  styles: ['italics'],
});
assetsLoader.registerFont({
  name: 'Courier',
  fileName: 'Courier-Bold',
  styles: ['bold'],
});
assetsLoader.registerFont({
  name: 'Courier',
  fileName: 'Courier-BoldOblique',
  styles: ['bolditalics'],
});

assetsLoader.registerFont({
  name: 'Helvetica',
  fileName: 'Helvetica',
  styles: ['normal'],
});
assetsLoader.registerFont({
  name: 'Helvetica',
  fileName: 'Helvetica-Oblique',
  styles: ['italics'],
});
assetsLoader.registerFont({
  name: 'Helvetica',
  fileName: 'Helvetica-Bold',
  styles: ['bold'],
});
assetsLoader.registerFont({
  name: 'Helvetica',
  fileName: 'Helvetica-BoldOblique',
  styles: ['bolditalics'],
});

assetsLoader
  .load()
  .then(() => {
    assetsLoader.configurePdfMake(pdfMake);
    console.log('fonts loaded');
  })
  .catch((errors) => {
    // will fail if one of the files fails to load
    // configure pdfMake with the files that loaded correctly
    assetsLoader.configurePdfMake(pdfMake);
    console.error('assets loading', errors);
  });

export const generatePdfUsingSvg = async ({ fabricRef, jexcelRef }) => {
  const screenShot = fabricRef.current.toObject();
  let obj = fabricRef.current._objects.filter((o) => {
    return o.type === 'text';
  });
  const objScreenShot = screenShot.objects.filter((o) => {
    return o.type === 'text';
  });
  const headers = jexcelRef.current.getHeaders().split(',');
  const filteredData = jexcelRef.current.getData().filter((a) =>
    a.some(function(x) {
      return x;
    })
  );
  const mapping = [];
  obj.forEach((i) => mapping.push(i.text.substring(2, i.text.length - 2)));

  const pdfContents = [];
  filteredData.forEach((data, idx) => {
    obj.forEach((i, idx) => {
      const { left, width } = i;
      i.text = data[headers.indexOf(mapping[idx])] + '';
      fabricRef.current.renderAll();
      if (i.textAlign === 'center')
        i.left = left + (width * i.scaleY) / 2 - (i.width * i.scaleY) / 2;
      if (i.textAlign === 'right')
        i.left = left + width * i.scaleY - i.width * i.scaleY;
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
      fit: [842, 595],
      ...(idx !== filteredData.length - 1 && { pageBreak: 'after' }),
    });
  });
  console.log(pdfContents);

  //reset text and text position
  obj.forEach((i, idx) => {
    i.text = objScreenShot[idx].text;
    i.left = objScreenShot[idx].left;
    fabricRef.current.requestRenderAll();
  });

  return {
    pageOrientation: 'landscape',
    pageMargins: 0,
    content: pdfContents,
  };

  // console.log(pdf)
  // return pdf;
  // obj.forEach((i, idx) => {
  //   i.text = '[[' + mapping[idx] + ']]';
  //   fabricRef.current.requestRenderAll();
  // });
};

export const previewPdf = async (args) => {
  const pdfDefinition = cloneDeep(await generatePdfUsingSvg(args));
  var win = window.open('', '_blank');
  pdfMake.createPdf(pdfDefinition).open({}, win);
};

export const downloadPdf = async (args) => {
  const pdfDefinition = cloneDeep(await generatePdfUsingSvg(args));
  pdfMake.createPdf(pdfDefinition).download();
};
