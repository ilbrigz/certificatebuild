import React, { useEffect, useState } from 'react'
import { fabric } from 'fabric'
import ReactTooltip from 'react-tooltip';
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
    MdClose
} from 'react-icons/md';

import { readAndCompressImage } from 'browser-image-resizer';


const Controls = ({ currentFabric, generatePdf, currentCanvas, fontSize }) => {
    const [selectedObj, setSelectedObj] = useState({})
    useEffect(() => {
        const fabricIns = currentFabric()
        if (fabricIns) {

            fabricIns.on("selection:created", (e) => {
                setSelectedObj(e.target)
            })
            fabricIns.on("selection:updated", (e) => {
                setSelectedObj(e.target)
            })
            fabricIns.on("selection:cleared", () => {
                setSelectedObj({})
            })
            fabricIns.on("object:scaling",
                function onObjectScaled(e) {
                    var scaledObject = e.target;
                    if (scaledObject.flipX === true || scaledObject.flipY === true) {
                        scaledObject.flipX = false;
                        scaledObject.flipY = false
                    }
                })
        }
    }, [currentFabric])

    const alignHorizotal = () => {
        const activeEl = currentFabric().getActiveObject();
        if (activeEl) currentFabric().centerObjectH(activeEl);
    };

    const alignVertical = () => {
        const activeEl = currentFabric().getActiveObject();
        if (activeEl) currentFabric().centerObjectV(activeEl);
    };

    const sendForward = () => {
        const activeEl = currentFabric().getActiveObject();
        if (activeEl && activeEl.type) {
            currentFabric().bringForward(activeEl);
            currentFabric().requestRenderAll();
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
        if (activeEl) {
            activeEl.set(property, value);
            currentFabric().requestRenderAll()
            // currentFabric().getActiveObject().then((item) => { console.log(item) });
            setSelectedObj(activeEl.toObject())
        }
    }

    const toggleProperty = (property, value, alternative) => {
        const activeEl = currentFabric().getActiveObject()
        if (!value && activeEl) {
            activeEl.set(property, !activeEl[property])
            currentFabric().requestRenderAll()
            setSelectedObj(activeEl.toObject())
            return;
        }
        if (activeEl) {
            console.log(activeEl[property])
            if (activeEl[property] === value) { activeEl.set(property, alternative) } else { activeEl.set(property, value) }
            currentFabric().requestRenderAll()
            setSelectedObj(activeEl.toObject())
        }
    }

    const onRemove = (e) => {
        const activeEl = currentFabric().getActiveObject();
        if (activeEl) {
            currentFabric().remove(activeEl);
        }
    };

    const onImageUpload = async (e) => {
        if (!e.target.files[0]) return;
        const image = e.target.files[0]
        e.target.value = null
        const config = {
            quality: 0.4,
            maxWidth: currentCanvas().width / 2,
            maxHeight: currentCanvas().height / 2,
            mimeType: image.type,
        };

        let inputforupload = await readAndCompressImage(image, config);

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
        console.log(currentFabric().toObject());
        // console.log(JSON.stringify( fabric));
    };

    const testing = () => {
        let obj = currentFabric().getObjects();
        obj.forEach(function (item, i) {
            console.log('plz work');
            console.log(item)
            item.set('fontFamily', 'OldLondon');
        });
        currentFabric().renderAll();
    };
    return (
        <>
            <div>

                <button onClick={testing}>testing</button>
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
                    onClick={() => { toggleProperty('fontStyle', 'italic', 'normal') }}
                    className={selectedObj.fontStyle === 'italic' ? 'orange' : ''}
                    data-tip="Italize Text" >
                    <MdFormatItalic />
                </button>
                <button
                    onClick={() => { toggleProperty('fontWeight', 'bold', 'normal') }}
                    className={selectedObj.fontWeight === 'bold' ? 'orange' : ''}
                    data-tip="Bold Text"
                >
                    <MdFormatBold />
                </button>
                <button
                    onClick={() => { toggleProperty('underline') }}
                    className={selectedObj.underline ? 'orange' : ''}
                    data-tip="Underline Text"
                >
                    <MdFormatUnderlined />
                </button>
                <button onClick={logCanvas}>LOG JSON</button>
                <button onClick={generatePdf}>download</button>
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
                <button
                    onClick={() => {
                        currentFabric().requestRenderAll();
                    }}
                >
                    rerender
          </button>
                <button onClick={onRemove}
                    data-tip="Remove Selection"
                ><MdClose /></button>
                <button onClick={() => {
                    currentFabric().requestRenderAll();
                }}>reredner</button>
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
            <input
                type="number"
                name="quantity"
                defaultValue={fontSize}
                key={fontSize}
                min="10"
                max="80"
                onChange={onSetFontSize}
            />
            <pre>{JSON.stringify(selectedObj, null, 2)}</pre>
            <ReactTooltip />
        </>
    )
}

export default Controls


