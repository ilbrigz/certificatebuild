import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { fabric } from 'fabric';
import {
  fabricItextOptions,
  fabricTextControlOptions,
  fabricTextboxControlOptions,
  fabricTextboxOptions,
} from '../../config/fabric.config';

import { readAndCompressImage } from 'browser-image-resizer';

const useControlHandlers = () => {
  const {
    fabricRef,
    jexcelRef,
    setSelectedObject,
    selectedObject,
  } = useContext(AppContext);

  const insertText = (e) => {
    let text;
    if (e.target.innerHTML === 'TEXT') {
      text = new fabric.IText(`Edit Me!`, {
        ...fabricItextOptions,
        top: (fabricRef.current.height / 5) * Math.random(),
        left: (fabricRef.current.width / 5) * Math.random(),
      });
      text.setControlsVisibility(fabricTextControlOptions);
    } else {
      text = new fabric.Textbox(
        'This is a textbox. You can dobble click me to start editing or expand me to your liking.',
        {
          ...fabricTextboxOptions,
          top: (fabricRef.current.height / 5) * Math.random(),
          left: (fabricRef.current.width / 5) * Math.random(),
        }
      );
      text.setControlsVisibility(fabricTextboxControlOptions);
    }
    fabricRef.current.add(text);
  };

  const onImageUpload = async (e) => {
    if (!e.target.files[0]) return;
    const image = e.target.files[0];
    e.target.value = null;
    const config = {
      quality: 0.4,
      maxWidth: fabricRef.current.width / 2,
      maxHeight: fabricRef.current.height / 2,
      mimeType: image.type,
    };

    let inputforupload = await readAndCompressImage(image, config);

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
        imageinstance.setControlsVisibility({ mtr: false });

        var cw = fabricRef.current.width;
        var ch = fabricRef.current.height;

        if (cw > ch) {
          imageinstance.scaleToWidth(fabricRef.current.width - 200);
          imageinstance.scaleToHeight(fabricRef.current.height - 200);
        } else {
          imageinstance.scaleToHeight(fabricRef.current.height - 200);
          imageinstance.scaleToWidth(fabricRef.current.width - 200);
        }
        fabricRef.current.add(imageinstance);
        fabricRef.current.centerObject(imageinstance);
      };
    };

    readerobj.readAsDataURL(inputforupload);
  };

  const toggleProperty = (property, value, alternative, style) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (!activeEl) return;
    if (!value) {
      if (activeEl.type === 'activeSelection') {
        const texts = activeEl._objects.filter((i) => i.type !== 'image');
        if (texts.every((i) => i[property] === texts[0][property])) {
          const current = texts[0][property];
          texts.forEach((i) => {
            i.set(property, !current);
          });
        } else {
          texts.forEach((i) => {
            i.set(property, true);
          });
        }
        fabricRef.current.requestRenderAll();
        setSelectedObject(activeEl.toObject());
        return;
      }
      if (activeEl.setSelectionStyles && activeEl.isEditing) {
        const hasStyle = activeEl.getStyleAtPosition(activeEl.selectionStart)[
          property
        ];
        activeEl.setSelectionStyles({
          [property]: hasStyle ? alternative || false : value || true,
        });
        activeEl.setCoords();
        fabricRef.current.requestRenderAll();
      } else {
        activeEl.set(property, !activeEl[property]);
        fabricRef.current.requestRenderAll();
        setSelectedObject(activeEl.toObject());
      }
      return;
    }
    if (activeEl.type === 'activeSelection') {
      const texts = activeEl._objects.filter((i) => i.type !== 'image');
      if (texts.every((i) => i[property] === texts[0][property])) {
        texts.forEach((i) => {
          if (i[property] === value) {
            i.set(property, alternative);
          } else {
            i.set(property, value);
          }
        });
      } else {
        texts.forEach((i) => {
          i.set(property, value);
        });
      }
      fabricRef.current.requestRenderAll();
      setSelectedObject(activeEl.toObject());
      return;
    }
    if (activeEl.setSelectionStyles && activeEl.isEditing) {
      console.log(activeEl.getSelectionStyles());
      const hasStyle = activeEl.getStyleAtPosition(activeEl.selectionStart)[
        property
      ];
      activeEl.setSelectionStyles({
        [property]: hasStyle === value ? alternative : value,
      });
      console.log(activeEl.getSelectionStyles());
    } else {
      if (activeEl[property] === value) {
        activeEl.set(property, alternative || !activeEl[property]);
      } else {
        activeEl.set(property, value || !activeEl[property]);
      }
    }
    activeEl.setCoords();
    fabricRef.current.requestRenderAll();
    setSelectedObject(activeEl.toObject());
  };

  const alignHorizotal = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) fabricRef.current.centerObjectH(activeEl);
  };

  const alignVertical = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) fabricRef.current.centerObjectV(activeEl);
    fabricRef.current.requestRenderAll();
  };

  const sendForward = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl && activeEl.type) {
      fabricRef.current.bringForward(activeEl);
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
    const activeEl = fabricRef.current.getActiveObject();
    if (!activeEl) return;
    if (activeEl && activeEl.type === 'activeSelection') {
      activeEl._objects.forEach((i) => {
        i.set('fontSize', e.target.value.toString());
        fabricRef.current.requestRenderAll();
      });
      setSelectedObject(activeEl.toObject());
      return;
    }
    if (activeEl.setSelectionStyles && activeEl.isEditing) {
      activeEl.setSelectionStyles({
        fontSize: e.target.value.toString(),
      });
    } else {
      activeEl.setSelectionStyles(
        {
          fontSize: e.target.value,
        },
        0,
        activeEl._text.length
      );
      activeEl.set('fontSize', e.target.value.toString());
    }
    activeEl.setCoords();
    fabricRef.current.renderAll();
  };

  const setFabricProperty = (property, value) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (!activeEl) return;
    if (activeEl && activeEl.type === 'activeSelection') {
      activeEl._objects.forEach((i) => {
        i.set(property, value);
        fabricRef.current.requestRenderAll();
      });
      setSelectedObject(activeEl.toObject());
      return;
    }
    if (activeEl.setSelectionStyles && activeEl.isEditing) {
      console.log(activeEl.isEditing);
      activeEl.setSelectionStyles({
        [property]: value,
      });
      activeEl.setCoords();
      fabricRef.current.requestRenderAll();
    } else {
      activeEl.setSelectionStyles(
        {
          [property]: value,
        },
        0,
        activeEl._text.length
      );
      activeEl.set(property, value);
      fabricRef.current.renderAll();
      setSelectedObject(activeEl.toObject());
    }
  };

  const onRemove = (e) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      if (activeEl.type === 'activeSelection') {
        activeEl._objects.forEach((i) => {
          if (i.type === 'text') {
            const headers = jexcelRef.current.getHeaders().split(',');
            if (headers.length === 1) {
              alert('1 column must remain');
              return;
            }
            headers.map((item, idx) => {
              if (item === i.text.substring(2, i.text.length - 2))
                jexcelRef.current.deleteColumn(idx);
              return;
            });
          }
          fabricRef.current.remove(i);
        });
        return;
      }
      if (activeEl.type === 'text') {
        const headers = jexcelRef.current.getHeaders().split(',');
        if (headers.length === 1) {
          alert('1 column must remain');
          return;
        }
        headers.map((item, idx) => {
          if (item === activeEl.text.substring(2, activeEl.text.length - 2))
            jexcelRef.current.deleteColumn(idx);
          return;
        });
      }
      fabricRef.current.remove(activeEl);
    }
  };

  const logCanvas = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      console.log(activeEl);
      return;
    }
    console.log(fabricRef.current.toJSON());
    // console.log(JSON.stringify( fabric));
  };

  const testing = () => {
    let obj = fabricRef.current.getObjects();
    obj.forEach(function(item, i) {
      item.text = 'hello';
    });
    fabricRef.current.renderAll();
  };

  const onColorChange = (color, e) => {
    setFabricProperty('fill', color.hex);
  };
  return {
    insertText,
    onImageUpload,
    toggleProperty,
    alignHorizotal,
    alignVertical,
    sendForward,
    sendBackward,
    onSetFontSize,
    setFabricProperty,
    onRemove,
    logCanvas,
    testing,
    onColorChange,
  };
};

// function addHandler() {
//   var el = this;
//   if ((obj = canvas.getActiveObject())) {
//     fn.call(el, obj);
//     canvas.renderAll();
//   }
// }

// function setStyle(object, styleName, value) {
//   if (object.setSelectionStyles && object.isEditing) {
//     var style = {};
//     style[styleName] = value;
//     object.setSelectionStyles(style);
//   } else {
//     object[styleName] = value;
//   }
// }

function getStyle(object, styleName) {
  return object.getSelectionStyles && object.isEditing
    ? object.getSelectionStyles()[styleName]
    : object[styleName];
}

// addHandler('underline', function(obj) {
//   var isUnderline =
//     (getStyle(obj, 'textDecoration') || '').indexOf('underline') > -1;
//   setStyle(obj, 'textDecoration', isUnderline ? '' : 'underline');
// });

//get active object
//check if style is present
//get selection style
//or get active object style
//set selection style
//or set object style
//renderAll
export default useControlHandlers;
