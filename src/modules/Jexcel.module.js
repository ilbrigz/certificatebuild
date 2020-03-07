import { fabric } from 'fabric'
import jexcel from 'jexcel';
import { makeid } from '../utilty/helper'
import { jexcelInstanceOptions } from '../config/jexcel.config'
import { fabricTextOptions } from '../config/fabric.config'


const jexcelInit = ({ fabricRef, divRef }) => {

    console.log(fabricRef, 'from jexcel $$$$$$$$$$$')
    //#########JEXCEL############
    const jexcelInstance = jexcel(divRef.current, {
        ...jexcelInstanceOptions,
        onchangeheader: (a, b, c, d) => {
            onColumnNameChange(b, c, d);
        },
        oninsertcolumn: (a, b, c, d) => {
            console.log(a, b);
            console.log(c, d);
            onHeaderInsert();
        },
        onbeforedeletecolumn: (a, b, c) => {
            return onHeaderDelete(b, c);
        },
    });


    const onColumnNameChange = (index, prevText, newText) => {
        if (!newText) return;
        const headers = jexcelInstance.getHeaders().split(',');
        const duplicates = headers.filter((i) => newText === i);
        if (duplicates.length > 1) {
            console.log(headers);
            alert('Column Name must be unique!');
            jexcelInstance.setHeader(index, prevText);
            return;
        }
        const objects = fabricRef.current
            .getObjects()
            .filter((item) => item.type === 'text');
        const alreadyPresent = objects.filter(
            (i) => i.text.substring(2, i.text.length - 2) === newText
        ).length;
        if (alreadyPresent) {
            return;
        }
        const text = objects.find(
            (i) => i.text.substring(2, i.text.length - 2) === prevText
        );
        if (!text) {
            return;
        }
        text.text = '[[' + newText + ']]';
        fabricRef.current.renderAll();
        text.setCoords();
    };

    const onHeaderInsert = () => {
        const objects = fabricRef.current
            .getObjects()
            .filter((item) => item.type === 'text');
        const headers = jexcelInstance.getHeaders().split(',');
        const newColumns = headers.filter(
            (header) =>
                !objects.find((object) => {
                    return object.text.substring(2, object.text.length - 2) === header;
                })
        );
        newColumns.forEach((headerName) => {
            const randomWord = makeid(3);
            jexcelInstance.setHeader(
                headers.indexOf(headerName),
                'Col-' + randomWord + '-' + headerName
            );
            const modiefiedHeader =
                '[[' + 'Col-' + randomWord + '-' + headerName + ']]';
            const text = new fabric.Text(modiefiedHeader, {
                // ...fabricTextOptions,
                top: (fabricRef.current.height / 5) * Math.random(),
                left: (fabricRef.current.width / 5) * Math.random(),
            });
            fabricRef.current.add(text);
        });
        fabricRef.current.renderAll();
    };


    const onHeaderDelete = (headerIndex, removeCount) => {
        const headers = jexcelInstance.getHeaders().split(',');
        const deletedHeaders = headers.slice(
            headerIndex,
            headerIndex + removeCount
        );
        console.log(deletedHeaders);
        const objects = fabricRef.current
            .getObjects()
            .filter((item) => item.type === 'text');

        const objectsToDelete = objects.filter((i) =>
            deletedHeaders.some(
                (htext) => htext === i.text.substring(2, i.text.length - 2)
            )
        );
        objectsToDelete.forEach((i) => {
            fabricRef.current.remove(i);
        });
        return true;
    };
    return jexcelInstance
}

export default jexcelInit;
