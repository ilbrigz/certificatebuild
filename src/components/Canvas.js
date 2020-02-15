import React from 'react';

const Canvas = React.memo(React.forwardRef((props, ref) => {
    console.log('rerendering')
    return (
        <canvas ref={ref} ></canvas>
    )
}))
export default Canvas;