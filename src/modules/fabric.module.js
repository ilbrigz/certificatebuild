export const addUndoRedo = function (fabric) {
    console.log('top', this)
    fabric.Canvas.prototype.historyInit = function () {
        this.historyUndo = [];
        this.historyNextState = this.historyNext();
        console.log('inner', this)
        this.on({
            "object:added": this.historySaveAction,
            "object:removed": this.historySaveAction,
            "object:modified": this.historySaveAction
        })
    }

    fabric.Canvas.prototype.test = function () {
        console.log(this)
    }

    fabric.Canvas.prototype.historyNext = function () {
        return JSON.stringify(this.toJSON(this.extraProps));
    }

    fabric.Canvas.prototype.historySaveAction = function () {
        if (this.historyProcessing)
            return;

        const json = this.historyNextState;
        this.historyUndo.push(json);
        this.historyNextState = this.historyNext();
    }

    fabric.Canvas.prototype.undo = function () {
        // The undo process will render the new states of the objects
        // Therefore, object:added and object:modified events will triggered again
        // To ignore those events, we are setting a flag.
        this.historyProcessing = true;

        const history = this.historyUndo.pop();
        if (history) {
            this.loadFromJSON(history).renderAll();
        }

        this.historyProcessing = false;
    }
    fabric.Canvas.prototype.historyInit()
}

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