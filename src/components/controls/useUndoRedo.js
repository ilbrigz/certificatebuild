
import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context';

var undoStack = [];
var redoStack = [];

function getByName(name) {
    if (!name || typeof name === 'undefined') {
        return [];
    }
    return this._objects.filter(function (o) {
        return o.name === name;
    });
}

const useUndoRedo = () => {
    const {
        fabricRef,
        jexcelRef,
        setSelectedObject,
        selectedObject,
    } = useContext(AppContext);
    const addRedoStack = (i) => {

    }

    const addUndoStack = ({ obj, type }) => {
        undoStack.push({ obj, type })
    }

    const onUndo = () => {

    }

}

export default useUndoRedo