import isEqual from 'lodash.isequal'
import { fabric } from 'fabric'
class UndoRedo {
    constructor() {
        this.selected = {};
        this.cloned = {};
        this.undo = [];
        this.redo = [];
        this.maxUndo = 15;
    }
    setSeleted = (selectedObj) => {
        if (!selectedObj) { return }
        this.selected = { ...selectedObj };

        if (selectedObj.type === 'i-text' || selectedObj.type === 'textbox' || selectedObj.type === 'text') {
            selectedObj.clone((cloned) => {
                this.cloned = cloned
            }, ['uid'])
        }
    }

    returnSelected = () => {
        return this.selected
    }

    onCanvasChange = ({ activeEl, eventType, fabricRef }) => {

        // check if we have the record of the prev state
        let toPushToUndo = {};
        switch (eventType) {
            case "object:modified":
                toPushToUndo = {
                    uid: this.cloned.uid,
                    eventType,
                    state: this.cloned,
                    aheadState: activeEl
                }
                break;
            case "object:propertySet":
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: {
                        fill: this.selected.fill
                    },
                    aheadState: {
                        fill: activeEl.fill
                    }
                }
                break;
            case "object:deleted":
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: activeEl,
                }
                break;
            case "object:added":
                toPushToUndo = {
                    uid: activeEl.uid,
                    eventType,
                    state: activeEl,
                }
                break;
            case "group:deleted":
                toPushToUndo = {
                    uid: activeEl._objects.map((o) => o.uid),
                    eventType,
                    state: activeEl
                }
                break;
            case "group:rotated":
            case "group:scaled":
            case "group:moved":
                console.log('from undo', this.selected)
                toPushToUndo = {
                    uid: activeEl._objects.map((o) => o.uid),
                    eventType,
                    state: this.cloned.objects.map(
                        i => ({
                            uid: i.uid,
                            scaleX: i.scaleX || 1,
                            top: i.top,
                            left: i.left,
                            scaleY: i.scaleY || 1,
                            angle: i.angle || 0,
                            skewX: i.skewX || 0,
                            skewY: i.skewY || 0,
                            width: i.width,
                        })
                    ),
                    aheadState: activeEl._objects.map(i => ({
                        uid: i.uid,
                        scaleX: i.scaleX || 1,
                        top: i.top,
                        left: i.left,
                        scaleY: i.scaleY || 0,
                        angle: i.angle || 0,
                        width: i.width,
                        skewX: i.skewX || 0,
                        skewY: i.skewY || 0,
                    }))
                }

                break;
            case "group:modified":
                console.log(this.cloned)
                toPushToUndo = {
                    uid: activeEl._objects.map((o) => o.uid),
                    eventType,
                    state: this.cloned,
                    aheadState: activeEl,
                }
                this.cloned = this.generateSelectionClone(fabricRef, activeEl)
                break;
            case "object:styled":
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: {
                        fontWeight: this.selected.fontWeight || "normal",
                        fontStyle: this.selected.fontStyle || "normal",
                        underline: this.selected.underline || false,
                        fontSize: this.selected.fontSize,
                        fill: this.selected.fill

                    },
                    aheadState: {
                        fontWeight: activeEl.fontWeight,
                        fontStyle: activeEl.fontStyle,
                        underline: activeEl.underline,
                        fontSize: activeEl.fontSize,
                        fill: activeEl.fill
                    }
                }
                if (isEqual(toPushToUndo.state, toPushToUndo.aheadState)) return
                break;
            case "object:moved":
            case "object:scaled":
            case "object:rotated":
            default:
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: {
                        scaleY: this.selected.scaleY || 1,
                        scaleX: this.selected.scaleX || 1,
                        top: this.selected.top,
                        left: this.selected.left,
                        angle: this.selected.angle || 0,
                        width: this.selected.width,
                    },
                    aheadState: {
                        scaleY: activeEl.scaleY || 1,
                        scaleX: activeEl.scaleX || 1,
                        top: activeEl.top,
                        left: activeEl.left,
                        angle: activeEl.angle || 0,
                        width: activeEl.width,
                    }
                }

                if (isEqual(toPushToUndo.state, toPushToUndo.aheadState)) return
                if (activeEl.type === 'activeSelection') this.cloned = this.generateSelectionClone(fabricRef, activeEl)
                break;
        }
        this.redo = []
        this.undo.push(toPushToUndo)
        console.log(this.undo)
        if (this.undo.length > this.maxUndo) { this.undo.shift() }
        this.setSeleted(activeEl)

    }

    doUndo = (fabricRef) => {
        let obj;
        if (!this.undo.length) return;
        const lastUndoState = this.undo.pop()
        if (lastUndoState.uid && !Array.isArray(lastUndoState.uid)) {
            obj = fabricRef.current._objects.find((o) => {
                return o.uid === lastUndoState.uid;
            });
        }
        let activeEl = fabricRef.current.getActiveObject()
        if (activeEl && activeEl.type === 'activeSelection') fabricRef.current.discardActiveObject()

        this.redo.push(lastUndoState)

        switch (lastUndoState.eventType) {
            case "object:modified":
                fabricRef.current.remove(obj)
                fabricRef.current.add(lastUndoState.state)
                if (activeEl) activeEl = lastUndoState.state
                break;
            case "object:deleted":
                fabricRef.current.add(lastUndoState.state)
                break;
            case "object:added":
                fabricRef.current.remove(lastUndoState.state)
                break;
            case "object:fill":
                //todo
                break;
            case "group:deleted":
                lastUndoState.state.canvas = fabricRef.current
                lastUndoState.state.forEachObject(function (obj) {
                    fabricRef.current.add(obj);
                });
                lastUndoState.state.setCoords();
                break;
            case "group:modified":
                const toRemove = fabricRef.current._objects.filter(i => lastUndoState.uid.includes(i.uid))
                toRemove.forEach((i) => {
                    fabricRef.current.remove(i)
                })
                lastUndoState.state.canvas = fabricRef.current
                //lastUndoState was selected when added
                // so we need to select it before adding objects
                fabricRef.current.setActiveObject(lastUndoState.state)
                lastUndoState.state.forEachObject(function (obj) {
                    fabricRef.current.add(obj);
                })
                lastUndoState.state.setCoords();

                if (activeEl && activeEl.type === 'activeSelection') {
                    const activeUid = activeEl.getObjects().map(i => i.uid)
                    if (isEqual(lastUndoState.uid.sort(), activeUid.sort())) {
                        activeEl = lastUndoState.state;
                    }
                } else {
                    fabricRef.current.discardActiveObject()
                }
                break;
            case "group:scaled":
            case "group:rotated":
            case "group:moved":
                fabricRef.current.forEachObject(obj => {
                    if (lastUndoState.uid.includes(obj.uid)) {
                        lastUndoState.state.forEach(i => {
                            if (i.uid === obj.uid) {
                                obj.set(i)
                                obj.setCoords();
                            }
                        })
                    }
                })
                break
            default:
                if (!obj) { return }
                console.log('setting property', obj)
                obj.set(lastUndoState.state)
                obj.setCoords();
        }

        //group:modified is tricky
        if (activeEl && activeEl.type === 'activeSelection' && lastUndoState.eventType !== "group:modified") {
            console.log('THIS IS RUNNING')
            const newSelection = new fabric.ActiveSelection(activeEl.getObjects(), { canvas: fabricRef.current });
            fabricRef.current.setActiveObject(newSelection);
        } else if (activeEl) {
            activeEl.canvas = fabricRef.current
            fabricRef.current.setActiveObject(activeEl)
        }
        fabricRef.current.renderAll()
        //this make sure the latest position is reflected

        if (lastUndoState.uid && !Array.isArray(lastUndoState.uid)) this.setSeleted(obj)
    }

    doRedo = (fabricRef) => {
        // this._isUndoingOrRedoing = true;
        let obj;
        if (!this.redo.length) return;
        const lastRedoState = this.redo.pop()
        if (lastRedoState.uid && !Array.isArray(lastRedoState.uid)) {
            obj = fabricRef.current._objects.find((o) => {
                return o.uid === lastRedoState.uid;
            });
        }
        let activeEl = fabricRef.current.getActiveObject()
        if (activeEl && activeEl.type === 'activeSelection') fabricRef.current.discardActiveObject()

        //push to redo 
        this.undo.push(lastRedoState)

        switch (lastRedoState.eventType) {
            case "object:modified":
                fabricRef.current.remove(obj)
                lastRedoState.state.setCoords()
                fabricRef.current.add(lastRedoState.aheadState)
                if (activeEl) activeEl = lastRedoState.aheadState
                break;
            case "object:deleted":
                fabricRef.current.remove(obj)
                break;
            case "object:added":
                fabricRef.current.add(lastRedoState.state)
                break;
            case "group:modified":
                const toRemove = fabricRef.current._objects.filter(i => lastRedoState.uid.includes(i.uid))
                toRemove.forEach((i) => {
                    fabricRef.current.remove(i)

                })
                lastRedoState.state.canvas = fabricRef.current
                lastRedoState.aheadState.forEachObject(function (obj) {
                    fabricRef.current.add(obj);
                })
                lastRedoState.aheadState.setCoords();

                if (activeEl && activeEl.type === 'activeSelection') {
                    const activeUid = activeEl.getObjects().map(i => i.uid)
                    if (isEqual(lastRedoState.uid.sort(), activeUid.sort())) {
                        activeEl = lastRedoState.aheadState;
                    }
                } else {
                    fabricRef.current.discardActiveObject()
                }
                break;
            case "group:deleted":
                lastRedoState.state.forEachObject(function (obj) {
                    fabricRef.current.remove(obj);
                });
                lastRedoState.state.setCoords();
                break;
            case "group:scaled":
            case "group:rotated":
            case "group:moved":

                fabricRef.current.forEachObject(obj => {
                    if (lastRedoState.uid.includes(obj.uid)) {
                        lastRedoState.aheadState.forEach(i => {
                            if (i.uid === obj.uid) {
                                obj.set(i)
                                obj.setCoords();
                            }
                        })
                    }
                })

                break
            default:
                if (!obj) { return }
                obj.set(lastRedoState.aheadState)
                obj.setCoords();

        }
        //group:modified is tricky
        if (activeEl && activeEl.type === 'activeSelection') {
            const newSelection = new fabric.ActiveSelection(activeEl.getObjects(), { canvas: fabricRef.current });
            fabricRef.current.setActiveObject(newSelection);
        } else if (activeEl) {
            activeEl.canvas = fabricRef.current
            fabricRef.current.setActiveObject(activeEl)
        }
        fabricRef.current.renderAll()
        //this make sure the latest position is reflected
        if (lastRedoState.uid) this.setSeleted(obj)
    }

    generateSelectionClone = (fabricRef, activeEl) => {
        const selectionUids = activeEl._objects.map(i => i.uid)
        const withUidObject = []
        fabricRef.current.forEachObject(obj => { if (selectionUids.includes(obj.uid)) { withUidObject.push(obj.toObject(['uid'])) } })
        const object = activeEl.toObject()
        object.objects = withUidObject.map(i => ({
            uid: i.uid,
            scaleY: i.scaleY,
            scaleX: i.scaleX,
            top: activeEl.top + (activeEl.height / 2) + i.top,
            left: activeEl.left + (activeEl.width / 2) + i.left,
            angle: i.angle,
            width: i.width,
        }))
        return object
    }

    log = () => {
        console.log(this.selected)
        console.log(this.undo)
        console.log(this.redo)
    }

}


const RU = new UndoRedo();
export default RU

