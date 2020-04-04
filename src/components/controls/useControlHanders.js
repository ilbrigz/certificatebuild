import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { fabric } from 'fabric';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import {
  fabricTextboxOptions,
} from '../../config/fabric.config';
import RU from '../../modules/fabricUndoRedo.class'

const debouncedStart = debounce((cb, b) => { if (b) { cb(b) } else { cb() } }, 500, {
  'leading': true,
  'trailing': false
})
const debounced = debounce((cb, b) => { if (b) { cb(b) } else { cb() } }, 500, {
  'leading': true,
  'trailing': true
})
const debouncedEnd = debounce((cb) => { cb() }, 500, {
  'leading': false,
  'trailing': true
})


// import { readAndCompressImage } from 'browser-image-resizer';

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
        fontFamily: 'Roboto',
        top: (fabricRef.current.height / 5) * Math.random(),
        left: (fabricRef.current.width / 5) * Math.random(),
      });
      text.type = 'i-text';
    } else {
      text = new fabric.Textbox(
        'This is a textbox. You can dobble click me to start editing or expand me to your liking.',
        {
          ...fabricTextboxOptions,
          top: (fabricRef.current.height / 5) * Math.random(),
          left: (fabricRef.current.width / 5) * Math.random(),
        }
      );
      text.type = 'textbox';
    }

    fabricRef.current.add(text);
    fabricRef.current.renderAll();
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


    const readerobj = new FileReader();

    readerobj.onload = function () {
      var imgElement = document.createElement('img');
      imgElement.src = readerobj.result;

      imgElement.onload = function () {
        var imageinstance = new fabric.Image(imgElement, {
          angle: 0,
          opacity: 1,
          cornerSize: 12,
        });

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
    // with image resize
    // let inputforupload = await readAndCompressImage(image, config);
    // readerobj.readAsDataURL(inputforupload);

    //without image resize
    readerobj.readAsDataURL(image);
  };

  const toggleProperty = (property, value, alternative) => {
    const activeEl = fabricRef.current.getActiveObject();
    if (!activeEl) return;
    if (!value) {
      // for multiple selection ( active elements )
      if (activeEl.type === 'activeSelection') {
        const texts = activeEl._objects.filter((i) => i.type !== 'image');
        if (!texts.length) { return }
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
        RU.onCanvasChange({ activeEl, eventType: 'object:modified' })
      } else {
        activeEl.set(property, !activeEl[property]);
        fabricRef.current.requestRenderAll();
        setSelectedObject(activeEl.toObject());
        RU.onCanvasChange({ activeEl, eventType: 'object:styled' })
      }
      return;
    }
    // those with not value provided ( defaults to bollean )
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
      const hasStyle = activeEl.getStyleAtPosition(activeEl.selectionStart)[
        property
      ];
      activeEl.setSelectionStyles({
        [property]: hasStyle === value ? alternative : value,
      });
      RU.onCanvasChange({ activeEl, eventType: 'object:modified' })
    } else {
      if (activeEl[property] === value) {
        activeEl.set(property, alternative || !activeEl[property]);
      } else {
        activeEl.set(property, value || !activeEl[property]);
      }
      RU.onCanvasChange({ activeEl, eventType: 'object:styled' })
    }
    activeEl.setCoords();
    fabricRef.current.requestRenderAll();
    setSelectedObject(activeEl.toObject());
  };

  const alignHorizotal = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) fabricRef.current.centerObjectH(activeEl);
    // TODO : activeSelection
    RU.onCanvasChange({ activeEl, eventType: 'object:moved' })
  };

  const alignVertical = () => {
    const activeEl = fabricRef.current.getActiveObject();
    if (activeEl) fabricRef.current.centerObjectV(activeEl);
    fabricRef.current.requestRenderAll();
    // TODO : activeSelection
    RU.onCanvasChange({ activeEl, eventType: 'object:moved' })
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

    let direction = e.target.value > parseInt(e.target.dataset.prevValue) ? 'up' : 'down'
    e.target.dataset.prevValue = e.target.value;
    const activeEl = fabricRef.current.getActiveObject();
    if (!activeEl) return;
    // for multiple selection ( active elements )
    if (activeEl.type === 'activeSelection') {
      const images = activeEl._objects.filter((i) => {
        return (i.type === 'image')

      })
      images.forEach((i) => activeEl.removeWithUpdate(i))
      debouncedStart(() => activeEl.clone((cloned) => {
        RU.selected = cloned;
        console.log(RU.selected)
      }, ['uid']))

      activeEl._objects.map((i) => {
        if (i.type === 'image') {
          return
        }
        i.setSelectionStyles(
          {
            fontSize: direction === 'up' ? i.fontSize++ : i.fontSize--,
          },
          0,
          i._text.length
        );
        //so that obj.fontSize is set for setSelectedObject state
        i.set({ fontSize: direction === 'up' ? i.fontSize++ : i.fontSize-- })
        fabricRef.current.requestRenderAll();
      });
      debouncedEnd(() => RU.onCanvasChange({ activeEl, eventType: 'group:modified' }))
      setSelectedObject(activeEl.toObject());
      return;
    }
    if (activeEl.setSelectionStyles && activeEl.isEditing) {
      activeEl.setSelectionStyles({
        fontSize: e.target.value.toString(),
      });
      debounced(() => {
        RU.onCanvasChange({ activeEl, eventType: 'object:modified' })
      })
    } else {
      activeEl.setSelectionStyles(
        {
          fontSize: e.target.value,
        },
        0,
        activeEl._text.length
      );
      activeEl.set({ fontSize: e.target.value })
      debounced(() => {
        RU.onCanvasChange({ activeEl, eventType: 'object:modified' })
      })

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

    if (!activeEl) { return }
    if (activeEl.type === 'activeSelection') {
      RU.onCanvasChange({ activeEl, eventType: 'group:deleted' })
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
    RU.onCanvasChange({ activeEl, eventType: 'object:deleted' })
    fabricRef.current.remove(activeEl);
  };

  const logCanvas = () => {
    console.log(selectedObject)
    let activeEl = fabricRef.current.getActiveObject();
    if (activeEl) {
      console.log(activeEl)
      return;
    }
    console.log(fabricRef.current.toJSON(['uid']));
    // console.log(JSON.stringify( fabric));
  };

  const undo = () => {
    const textUndo = document.execCommand('undo', false, null);
    const hasSelectedText = RU.returnSelected()

    if (textUndo && (hasSelectedText === 'i-text' || hasSelectedText === 'textbox')) return;
    RU.doUndo(fabricRef)

  }
  const redo = () => {
    const textRedo = document.execCommand('redo', false, null);
    const hasSelectedText = RU.returnSelected()
    if (textRedo && (hasSelectedText === 'i-text' || hasSelectedText === 'textbox')) return;
    RU.doRedo(fabricRef)
  }

  const testing = () => {
    let obj = fabricRef.current.getObjects();
    obj.forEach(function (item, i) {
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
    undo,
    redo
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
