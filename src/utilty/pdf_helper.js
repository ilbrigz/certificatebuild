export const centeredTextProperties = (jsonCanvas, pageWidth) => {
    if (jsonCanvas.left + jsonCanvas.width / 2 >
        pageWidth / 2) return ({
            absolutePosition: {
                x: centerText(
                    jsonCanvas.left,
                    jsonCanvas.width,
                    842
                ),
                y: jsonCanvas.top - 2,
            },
            alignment: 'center'
        })
    return ({
        relativePosition: {
            x: 0,
            y: jsonCanvas.top - 2,
        },
        margin: checkRightMargin(
            jsonCanvas.left,
            jsonCanvas.width,
            842
        ),
        alignment: 'center'
    })
}

export const leftOrRightAlignedTextProperties = (jsonCanvas, pageLength) => {
    if (jsonCanvas.textAlign === 'left') return ({
        absolutePosition: {
            x: jsonCanvas.left,
            y: jsonCanvas.top - 2,
        },
        alignment: 'left'
    })
    return ({
        relativePosition: {
            x: 0,
            y: jsonCanvas.top - 2,
        },
        alignment: 'right',
        margin: [0, 0, pageLength - (jsonCanvas.left + jsonCanvas.width), 0]
    })

}

export const textboxMargin = (x, objectLength, pageLength) => {
    //somehow i need to subtract only the objectLength and not the position x
    const rightMargin = pageLength - (objectLength);
    return [0, 0, rightMargin, 0];
}


//for text that cross half of the width
// move the text back equal to the right margin
// for aligned center
function centerText(x, objectLength, pageLength) {
    const centerOfObject = x + objectLength / 2;
    if (centerOfObject > pageLength / 2) {
        return centerOfObject - (pageLength - centerOfObject);
    } else {
        return 0;
    }
}

function checkRightMargin(x, objectLength, pageLength) {
    const centerOfObject = x + objectLength / 2;
    if (centerOfObject < pageLength / 2) {
        const rightMargin = pageLength - 2 * centerOfObject;
        return [0, 0, rightMargin, 0];
    } else {
        return [0, 0, 0, 0];
    }
}