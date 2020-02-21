import React from 'react'
import { fabric } from 'fabric'
import FontFaceObserver from 'fontfaceobserver';

const useFabric = ({ canvasId, options }) => {

    const canvasRef = React.useRef(null)
    const [selectedObject, setSelectedObject] = React.useState({})

    React.useEffect(() => {
        var myfont = new FontFaceObserver('OldLondon');
        myfont.load().then(() => {
            const canvas = new fabric.Canvas(canvasId, {
                objectCaching: false,
                preserveObjectStacking: true,
                fontSize: 20,
                altActionKey: 'none',
                selectionKey: 'ctrlKey',
                allowTouchScrolling: true,
            })
            canvasRef.current = canvas;

            fabricRef.current.on('object:moving', preventOutsideMovement);
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
            });
            fabricRef.current.on('selection:created', (e) => {
                if (e.target.fontSize) {
                    setFontSize(parseInt(e.target.fontSize));
                }
            });
            fabricRef.current.setHeight(595);
            fabricRef.current.setWidth(842);
            fabricRef.current.renderAll();

            return () => {
                fabricRef.current.removeListeners();
                fabricRef.current.dispose();
                canvasRef.current = null;
            };
        }
    }, [id])

    return {
        canvasRef,
        selectedObject,
        setSelectedObject,
    };
}

export default useFabric;