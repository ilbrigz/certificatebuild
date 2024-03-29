import { fabric } from 'fabric'
import { preventOutsideMovement } from '../utilty/canvass_helper';
import { makeid } from '../utilty/helper'
import RU from './fabricUndoRedo.class'
export const addSelectedObjectListener = (fabricRef, e) => {
    const { key, keyCode } = e;
    const activeEl = fabricRef.current.getActiveObject();
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
    }

    if (keyCode >= 65 && keyCode <= 90) {
    }
}
//fabric events
export const addCanvasLister = ({ selectedObject, setSelectedObject, fabricRef }) => {
    if (!fabricRef.current) return;
    fabricRef.current.on('object:moving', preventOutsideMovement);
    fabricRef.current.on('object:modified', (e) => {
        if (e.target.addedToRU) {
            delete e.target.addedToRU
            return
        }
        RU.onCanvasChange({ activeEl: e.target, eventType: 'object:modified' })
    })
    fabricRef.current.on('object:moved', (e) => {
        e.target.setControlsVisibility({
            tl: true, //top-left
            mt: true, // middle-top
            tr: true, //top-right
            ml: true, //middle-left
            mr: true, //middle-right
            bl: true, // bottom-left
            mb: true, //middle-bottom
            br: true, //bottom-right
            mtr: true //bottom-right
        })
        e.target.addedToRU = "object:moved"
        if (e.target.type === 'activeSelection') {
            //discard to to add update the e.tagerget dimensions
            fabricRef.current.discardActiveObject()
            //add to undo
            RU.onCanvasChange({ activeEl: e.target, eventType: 'group:moved' })
            //update the clone
            if (e.target.type === "activeSelection") RU.cloned = RU.generateSelectionClone(fabricRef, e.target)
            // select the discarded selection
            const newSelection = new fabric.ActiveSelection(e.target.getObjects(), { canvas: fabricRef.current });
            fabricRef.current.setActiveObject(newSelection);
            return;
        }
        RU.onCanvasChange({ activeEl: e.target, eventType: 'object:moved' })
    });
    fabricRef.current.on('object:scaled', (e) => {
        e.target.addedToRU = "object:scaled"
        console.log('scaled')
        if (e.target.type === 'activeSelection') {
            fabricRef.current.discardActiveObject()
            //add to undo
            RU.onCanvasChange({ activeEl: e.target, eventType: 'group:scaled' })
            if (e.target.type === "activeSelection") RU.cloned = RU.generateSelectionClone(fabricRef, e.target)
            // select the discarded selection
            const newSelection = new fabric.ActiveSelection(e.target.getObjects(), { canvas: fabricRef.current });
            fabricRef.current.setActiveObject(newSelection);
            return;
        }
        RU.onCanvasChange({ activeEl: e.target, eventType: 'object:scaled' })
    });
    fabricRef.current.on('object:rotated', (e) => {
        e.target.addedToRU = "object:rotated"
        console.log('rotated')
        if (e.target.type === 'activeSelection') {
            fabricRef.current.discardActiveObject()
            //add to undo
            RU.onCanvasChange({ activeEl: e.target, eventType: 'group:rotated' })
            if (e.target.type === "activeSelection") RU.cloned = RU.generateSelectionClone(fabricRef, e.target)
            // select the discarded selection
            const newSelection = new fabric.ActiveSelection(e.target.getObjects(), { canvas: fabricRef.current });
            fabricRef.current.setActiveObject(newSelection);
            return;
        }
        RU.onCanvasChange({ activeEl: e.target, eventType: 'object:rotated' })
    });
    fabricRef.current.on('selection:created', (e) => {
        if (e.target.type !== 'activeSelection') { RU.setSeleted(e.target) }
        else { RU.cloned = RU.generateSelectionClone(fabricRef, e.target) }
        console.log(RU.selected)
        window.addEventListener('keydown', handleUserKeyPress.bind(null, fabricRef)
        );
    });
    fabricRef.current.on('selection:updated', (e) => {
        console.log('selection updated')
        const activeEl = fabricRef.current.getActiveObject();
        RU.setSeleted(activeEl)
    });
    fabricRef.current.on('object:moving', (e) => {
        console.log('object:moving')
        if (!e.target) return
        e.target.setControlsVisibility({
            tl: false, //top-left
            mt: false, // middle-top
            tr: false, //top-right
            ml: false, //middle-left
            mr: false, //middle-right
            bl: false, // bottom-left
            mb: false, //middle-bottom
            br: false, //bottom-right
            mtr: false //bottom-right
        })

    });
    fabricRef.current.on('selection:cleared', (e) => {
        setSelectedObject({});
        RU.selected = null
        window.removeEventListener('keydown', handleUserKeyPress);
    });

    fabricRef.current.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY;
        delta = (opt.e.deltaY > 0) ? -(opt.e.deltaY) : -(opt.e.deltaY);
        if (delta > 0) {

            const originalRender = fabric.Image.prototype.render;
            fabric.Image.prototype.render = function (ctx, noTransform) {
                // console.time("originalRender start");
                if (!this.isOnScreen()) {
                    return;
                }
                // console.timeEnd("originalRender start");
                return originalRender.call(this, ctx, noTransform);
            };
        }
        // console.time("actual zoom calculation start");
        var zoom = fabricRef.current.getZoom();
        zoom = zoom + delta / 200;
        zoom = (delta > 0) ? zoom * 1 : zoom / 1;
        let zoomValueForDraggableCircles = zoom;
        if (zoom > 40) zoom = 40;
        if (zoom < 1) {
            zoom = 1;
            fabricRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);
        }
        //canvas.setZoom(zoom);
        fabricRef.current.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        // console.timeEnd("actual zoom calculation start");
        opt.e.preventDefault();
        opt.e.stopPropagation();
        // console.timeEnd("mouse:wheel start");
    });

    fabricRef.current.on('mouse:up', (e) => {
        // FIX ME : Breaks the insert text : type is not a property to text and textbox (FIXED)
        // this will update the selected objected when in type mode cursor
        const activeEl = fabricRef.current.getActiveObject();
        if (!activeEl) return;
        if (activeEl.type === 'image') {
            setSelectedObject(activeEl)
            return;
        }
        if (activeEl.getStyleAtPosition) {
            setSelectedObject({ ...activeEl, ...activeEl.getStyleAtPosition(activeEl.selectionStart || 1) });
        } else {
            setSelectedObject(activeEl)

        }
    })
    // mild snapping
    fabricRef.current.on('object:moving', function (options) {
        if (
            options.target.type === 'image' &&
            Math.round((options.target.left / 50) * 4) % 4 == 0 &&
            Math.round((options.target.top / 50) * 4) % 4 == 0
        ) {
            options.target
                .set({
                    left: Math.round(options.target.left / 50) * 50,
                    top: Math.round(options.target.top / 50) * 50,
                })
                .setCoords();
        }
    })
}

export const eventCleanUp = () => {
    window.removeEventListener('keydown', handleUserKeyPress);
}


function handleUserKeyPress(fabricRef, e) {
    addSelectedObjectListener(fabricRef, e);
}


