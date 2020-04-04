import cloneDeep from 'clone-deep'
import { fabric } from 'fabric'
import isEqual from 'lodash.isequal'
class UndoRedo {
    constructor() {
        this.selected = {};
        this.cloned = {};
        this.undo = [];
        this.redo = [];
        this.fontSize = []
    }
    setFontSize = (size) => {
        this.fontSize.push(size)
    }
    setSeleted = (selectedObj) => {
        if (!selectedObj) { return }
        this.selected = { ...selectedObj };
        if (selectedObj.type === 'i-text' || selectedObj.type === 'textbox') {
            selectedObj.clone((cloned) => {
                this.cloned = cloned
            }, ['uid'])
        }
        console.log(this.cloned)
    }

    clearSelected = () => {
        this.selected = {}
    }
    returnSelected = () => {
        return this.selected
    }

    onCanvasChange = ({ activeEl, eventType }) => {
        //if isUndoingOrRedoing is true then the chane is trigerred by undo or redo
        //then stop and change it to false
        // if (this._isUndoingOrRedoing) {
        //     this._isUndoingOrRedoing = false;
        //     return
        // };
        // check if we have the record of the prev state
        if (!this.selected) { return };
        let toPushToUndo = {};
        switch (eventType) {
            case "object:modified":
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: this.cloned,
                    aheadState: activeEl
                }
                break;
            case "object:deleted":
                toPushToUndo = {
                    uid: this.selected.uid,
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
            case "group:modified":
                toPushToUndo = {
                    uid: activeEl._objects.map((o) => o.uid),
                    eventType,
                    state: this.selected,
                    aheadState: activeEl,
                }
                break;
                // case "group:fontSize":
                //     if (!this.fontSize) return;
                //     toPushToUndo = {
                //         uid: activeEl._objects.map((o) => {
                //             if (o.type === 'image') { return }
                //             return o.uid
                //         }),
                //         eventType,
                //         state: this.fontSize[1] ? this.fontSize[1] - this.fontSize[0] + 1 : 1
                //     }
                //     this.fontSize = [];

                break;
            case "object:styled":
                console.log('styled')
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: {
                        fontWeight: this.selected.fontWeight,
                        fontStyle: this.selected.fontStyle,
                        underline: this.selected.underline,
                        fontSize: this.selected.fontSize

                    },
                    aheadState: {
                        fontWeight: activeEl.fontWeight,
                        fontStyle: activeEl.fontStyle,
                        underline: activeEl.underline,
                        fontSize: activeEl.fontSize
                    }
                }
                // if (isEqual(toPushToUndo.state, toPushToUndo.aheadState)) return
                break;
            case "object:moved":
            case "object:scaled":
            case "object:rotated":
            default:
                toPushToUndo = {
                    uid: this.selected.uid,
                    eventType,
                    state: {
                        scaleY: this.selected.scaleY,
                        scaleX: this.selected.scaleX,
                        top: this.selected.top,
                        left: this.selected.left,
                        angle: this.selected.angle,
                        width: this.selected.width,
                    },
                    aheadState: {
                        scaleY: activeEl.scaleY,
                        scaleX: activeEl.scaleX,
                        top: activeEl.top,
                        left: activeEl.left,
                        angle: activeEl.angle,
                        width: activeEl.width,
                    }
                }

                if (isEqual(toPushToUndo.state, toPushToUndo.aheadState)) return
                break;
        }
        this.redo = []
        this.undo.push(toPushToUndo)
        console.log(this.selected)
        this.setSeleted(activeEl)

    }

    doUndo = (fabricRef) => {
        // this._isUndoingOrRedoing = true;
        let obj;
        if (!this.undo.length) return;
        const lastUndoState = this.undo.pop()
        if (lastUndoState.uid && !Array.isArray(lastUndoState.uid)) {
            obj = fabricRef.current._objects.find((o) => {
                return o.uid === lastUndoState.uid;
            });
        }
        console.log('object', obj)
        //push to redo 
        this.redo.push(lastUndoState)

        switch (lastUndoState.eventType) {
            case "object:modified":
                // obj.set(lastUndoState.state)
                fabricRef.current.remove(obj)
                lastUndoState.state.setCoords()
                fabricRef.current.add(lastUndoState.state)
                break;
            case "object:deleted":
                fabricRef.current.add(lastUndoState.state)
                break;
            case "group:deleted":
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
                lastUndoState.state.set({
                    left: lastUndoState.state.left,
                    top: lastUndoState.state.top,
                    evented: true,
                });
                lastUndoState.state.camvas = fabricRef.current
                lastUndoState.state.forEachObject(function (obj) {
                    // obj.set({
                    //     left: obj.left + (lastUndoState.state.left + lastUndoState.state.width / 2),
                    //     top: obj.top + (lastUndoState.state.top + lastUndoState.state.height / 2),
                    //     evented: true
                    // })
                    fabricRef.current.add(obj);
                })
                lastUndoState.state.setCoords();
                fabricRef.current.setActiveObject(lastUndoState.state);
                fabricRef.current.requestRenderAll();
                // fabricRef.current.discardActiveObject();
                // var sel = new fabric.ActiveSelection(fabricRef.current.getObjects(), {
                //     canvas: fabricRef.current,
                // });
                // fabricRef.current.setActiveObject(sel)
                // fabricRef.current.discardActiveObject();
                break;
            case "group:fontSize":
                fabricRef.current._objects.forEach((o) => {
                    if (lastUndoState.uid.includes(o.uid) && o.type !== "image") {
                        o.setSelectionStyles(
                            {
                                fontSize: o.fontSize - lastUndoState.state,
                            },
                            0,
                            o._text.length
                        );
                        //so that obj.fontSize is set for setSelectedObject state
                        o.set({ fontSize: o.fontSize - lastUndoState.state })
                    }
                });
                break;
            default:
                if (!obj) { return }
                console.log(obj)
                obj.set(lastUndoState.state)
                // if (lastUndoState.state.fontSize) { obj.set('fontSize', lastUndoState.state.fontSize) }
                obj.setCoords();


        }

        fabricRef.current.renderAll()
        //this make sure the latest position is reflected

        if (lastUndoState.uid && !Array.isArray(lastUndoState.uid)) this.setSeleted(obj)
    }

    doRedo = (fabricRef) => {
        // this._isUndoingOrRedoing = true;
        let obj;
        if (!this.redo.length) return;
        console.log(this.redo)
        const lastRedoState = this.redo.pop()
        if (lastRedoState.uid) {
            obj = fabricRef.current._objects.find((o) => {
                return o.uid === lastRedoState.uid;
            });
        }
        //push to redo 
        this.undo.push(lastRedoState)

        switch (lastRedoState.eventType) {
            case "object:modified":
                fabricRef.current.remove(obj)
                lastRedoState.state.setCoords()
                fabricRef.current.add(lastRedoState.aheadState)
                break;
            case "object:deleted":
                fabricRef.current.remove(obj)
                break;
            case "group:modified":
                const toRemove = fabricRef.current._objects.filter(i => lastRedoState.uid.includes(i.uid))
                toRemove.forEach((i) => {
                    fabricRef.current.remove(i)

                })
                lastRedoState.aheadState.forEachObject(function (obj) {
                    fabricRef.current.add(obj);
                })
                lastRedoState.state.setCoords();
                fabricRef.current.discardActiveObject();
                var sel = new fabric.ActiveSelection(fabricRef.current.getObjects(), {
                    canvas: fabricRef.current,
                });
                fabricRef.current.setActiveObject(sel)
                fabricRef.current.discardActiveObject();
                break;
            case "group:deleted":
                lastRedoState.state.forEachObject(function (obj) {
                    fabricRef.current.remove(obj);
                });
                lastRedoState.state.setCoords();
                break;
            default:
                if (!obj) { return }
                obj.set(lastRedoState.aheadState)
                obj.setCoords();

        }
        fabricRef.current.renderAll()
        //this make sure the latest position is reflected

        if (lastRedoState.uid) this.setSeleted(obj)
    }

    log = () => {
        console.log(this.selected)
        console.log(this.undo)
        console.log(this.redo)
    }

}


const RU = new UndoRedo();
export default RU

