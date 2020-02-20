import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import ReactTooltip from 'react-tooltip';
import Button from '@material-ui/core/Button';
import { CompactPicker } from 'react-color';
import {
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaSortNumericUp,
  FaSortNumericDown,
} from 'react-icons/fa';

import {
  MdBorderVertical,
  MdBorderHorizontal,
  MdFormatItalic,
  MdFormatBold,
  MdFormatUnderlined,
  MdClose,
  MdTitle,
} from 'react-icons/md';
import { AiOutlineFontColors } from 'react-icons/ai';

import {
  fabricTextboxOptions,
  fabricTextControlOptions,
  fabricTextboxControlOptions,
  fabricItextOptions,
} from '../config/fabric.config';
import { AiOutlineFontSize } from 'react-icons/ai';

import { readAndCompressImage } from 'browser-image-resizer';

const Controls = ({ currentFabric, generatePdf, currentCanvas, fontSize }) => {
  const [selectedObj, setSelectedObj] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  useEffect(() => {
    const fabricIns = currentFabric();
    if (fabricIns) {
      fabricIns.on('selection:created', (e) => {
        setSelectedObj(e.target);
      });
      fabricIns.on('selection:updated', (e) => {
        setSelectedObj(e.target);
      });
      fabricIns.on('selection:cleared', () => {
        setSelectedObj({});
      });
      fabricIns.on('object:scaling', function onObjectScaled(e) {
        var scaledObject = e.target;
        if (scaledObject.flipX === true || scaledObject.flipY === true) {
          scaledObject.flipX = false;
          scaledObject.flipY = false;
        }
      });
    }
  }, [currentFabric]);

  const alignHorizotal = () => {
    const activeEl = currentFabric().getActiveObject();
    // if (activeEl.type === 'activeSelection') {
    //     //somehow I need to subtract half the canvas width to center each element
    //     const halfCanvas = currentCanvas().width / 2
    //     activeEl._objects.forEach(i => {
    //         currentFabric().centerObjectH(i)
    //         i.left = i.left - halfCanvas
    //         return
    //     })
    // }
    if (activeEl) currentFabric().centerObjectH(activeEl);
  };

  const alignVertical = () => {
    const activeEl = currentFabric().getActiveObject();
    if (activeEl) currentFabric().centerObjectV(activeEl);
    currentFabric().requestRenderAll();
  };

  const sendForward = () => {
    const activeEl = currentFabric().getActiveObject();
    if (activeEl && activeEl.type) {
      currentFabric().bringForward(activeEl);
    }
  };

  const sendBackward = () => {
    const activeEl = currentFabric().getActiveObject();
    if (activeEl && activeEl.type) {
      currentFabric().sendBackwards(activeEl);
      currentFabric().requestRenderAll();
    }
  };

  const onSetFontSize = (e) => {
    console.log(e.target.value);
    const activeEl = currentFabric().getActiveObject();
    if (activeEl) {
      activeEl.set('fontSize', e.target.value.toString());
      currentFabric().requestRenderAll();
    }
  };

  const setFabricProperty = (property, value) => {
    const activeEl = currentFabric().getActiveObject();
    if (activeEl && activeEl.type === 'activeSelection') {
      activeEl._objects.forEach((i) => {
        i.set(property, value);
        currentFabric().requestRenderAll();
      });
      setSelectedObj(activeEl.toObject());
      return;
    }
    if (activeEl) {
      activeEl.set(property, value);
      currentFabric().requestRenderAll();
      setSelectedObj(activeEl.toObject());
    }
  };

  const toggleProperty = (property, value, alternative) => {
    const activeEl = currentFabric().getActiveObject();
    if (!value && activeEl) {
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
        currentFabric().requestRenderAll();
        setSelectedObj(activeEl.toObject());
        return;
      }
      activeEl.set(property, !activeEl[property]);
      currentFabric().requestRenderAll();
      setSelectedObj(activeEl.toObject());
      return;
    }
    if (activeEl) {
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
        currentFabric().requestRenderAll();
        setSelectedObj(activeEl.toObject());
        return;
      }
      console.log(activeEl[property]);
      if (activeEl[property] === value) {
        activeEl.set(property, alternative);
      } else {
        activeEl.set(property, value);
      }
      currentFabric().requestRenderAll();
      setSelectedObj(activeEl.toObject());
    }
  };

  const onRemove = (e) => {
    const activeEl = currentFabric().getActiveObject();
    if (activeEl) {
      if (activeEl.type === 'activeSelection') {
        activeEl._objects.forEach((i) => currentFabric().remove(i));
        return;
      }
      currentFabric().remove(activeEl);
    }
  };

  const onImageUpload = async (e) => {
    if (!e.target.files[0]) return;
    const image = e.target.files[0];
    e.target.value = null;
    const config = {
      quality: 0.4,
      maxWidth: currentCanvas().width / 2,
      maxHeight: currentCanvas().height / 2,
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

        var cw = currentCanvas().width;
        var ch = currentCanvas().height;

        if (cw > ch) {
          imageinstance.scaleToWidth(currentCanvas().width - 200);
          imageinstance.scaleToHeight(currentCanvas().height - 200);
        } else {
          imageinstance.scaleToHeight(currentCanvas().height - 200);
          imageinstance.scaleToWidth(currentCanvas().width - 200);
        }
        currentFabric().add(imageinstance);
        currentFabric().centerObject(imageinstance);
      };
    };

    readerobj.readAsDataURL(inputforupload);
  };

  const logCanvas = () => {
    const activeEl = currentFabric().getActiveObject();
    if (activeEl) {
      console.log(activeEl.toObject());
      return;
    }
    console.log(currentFabric().toDatalessJSON());
    // console.log(JSON.stringify( fabric));
  };

  const testing = () => {
    let obj = currentFabric().getObjects();
    obj.forEach(function(item, i) {
      item.text = 'hello';
    });
    currentFabric().renderAll();
  };
  const insertText = (e) => {
    let text;
    if (e.target.innerHTML === 'TEXT') {
      text = new fabric.IText(`Edit Me!`, {
        ...fabricItextOptions,
        fontWeight: 'bold',
        top: (currentCanvas().height / 5) * Math.random(),
        left: (currentCanvas().width / 5) * Math.random(),
      });
      text.setControlsVisibility(fabricTextControlOptions);
    } else {
      text = new fabric.Textbox(
        'Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto Lorem ipsum dibus repellat iusto.',
        {
          ...fabricTextboxOptions,
          top: (currentCanvas().height / 5) * Math.random(),
          left: (currentCanvas().width / 5) * Math.random(),
        }
      );
      text.setControlsVisibility(fabricTextboxControlOptions);
    }
    currentFabric().add(text);
  };
  const onColorChange = (color, e) => {
    setFabricProperty('fill', color.hex);
  };
  return (
    <>
      <div style={{ minHeight: '31px' }}>
        {!!selectedObj.type && (
          <>
            <button
              data-tip="Text Align Left"
              onClick={() => setFabricProperty('textAlign', 'left')}
              className={selectedObj.textAlign === 'left' ? 'orange' : ''}
            >
              <FaAlignLeft />
            </button>
            <button
              data-tip="Text Align Center"
              onClick={() => setFabricProperty('textAlign', 'center')}
              className={selectedObj.textAlign === 'center' ? 'orange' : ''}
            >
              <FaAlignCenter />
            </button>
            <button
              data-tip="Text Align Right"
              onClick={() => setFabricProperty('textAlign', 'right')}
              className={selectedObj.textAlign === 'right' ? 'orange' : ''}
            >
              <FaAlignRight />
            </button>
            <button
              onClick={() => {
                toggleProperty('fontStyle', 'italic', 'normal');
              }}
              className={selectedObj.fontStyle === 'italic' ? 'orange' : ''}
              data-tip="Italize Text"
            >
              <MdFormatItalic />
            </button>
            <button
              onClick={() => {
                toggleProperty('fontWeight', 'bold', 'normal');
              }}
              className={selectedObj.fontWeight === 'bold' ? 'orange' : ''}
              data-tip="Bold Text"
            >
              <MdFormatBold />
            </button>
            <button
              onClick={() => {
                toggleProperty('underline');
              }}
              className={selectedObj.underline ? 'orange' : ''}
              data-tip="Underline Text"
            >
              <MdFormatUnderlined />
            </button>
            <button data-tip="Center Horizontally" onClick={alignHorizotal}>
              <MdBorderVertical />
            </button>

            <button data-tip="Center Horizontally" onClick={alignVertical}>
              <MdBorderHorizontal />
            </button>
            <button data-tip="Send Forward" onClick={sendForward}>
              <FaSortNumericUp />
            </button>
            <button data-tip="Send Backward" onClick={sendBackward}>
              <FaSortNumericDown />
            </button>
            <button onClick={onRemove} data-tip="Delete Selected Item">
              <MdClose />
            </button>
            <ReactTooltip />
          </>
        )}
        <button onClick={logCanvas}>LOG JSON</button>
        <button onClick={generatePdf}>download</button>
        <button
          onClick={() => {
            currentFabric().requestRenderAll();
          }}
        >
          rerender
        </button>
        <button
          onClick={() => {
            currentFabric().requestRenderAll();
          }}
        >
          reredner
        </button>
        <button onClick={testing}>testing</button>
      </div>

      <label className="myLabel">
        <input
          type="file"
          id="file"
          onChange={onImageUpload}
          accept="image/*"
        />
        <span>Upload Image</span>
      </label>
      <label className="myLabel">
        <input
          type="number"
          name="quantity"
          defaultValue={fontSize}
          key={fontSize}
          min="10"
          max="80"
          onChange={onSetFontSize}
        />
        <span>
          <AiOutlineFontSize />
        </span>
      </label>
      <button data-tip data-for="clickme">
        Insert Editable Text
      </button>
      <ReactTooltip
        id="clickme"
        place="bottom"
        delayHide={1000}
        effect="solid"
        clickable={true}
      >
        <button onClick={insertText}>TEXT</button>
        <button onClick={insertText}>TEXTBOX</button>
      </ReactTooltip>
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <button onClick={() => setShowPicker(!showPicker)}>
          <AiOutlineFontColors fill={selectedObj.fill || 'white'} />
        </button>
        {showPicker ? (
          <div
            style={{ position: 'absolute', zIndex: 999, top: 0, left: '100%' }}
          >
            <div
              onClick={() => setShowPicker(false)}
              style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              }}
            ></div>
            <CompactPicker
              color={selectedObj.fill || '#000000'}
              onChangeComplete={onColorChange}
            />
          </div>
        ) : null}
        <Button variant="outlined">test</Button>
      </div>
      {/* <pre>{JSON.stringify(selectedObj, null, 2)}</pre> */}
    </>
  );
};

export default Controls;
