import React from 'react';

const Canvas = React.forwardRef((props, ref) => {
    return (
        <canvas ref={ref} ></canvas>
    )
})
export default Canvas;