import React from 'react';

const Canvas = React.memo(React.forwardRef((props, ref) => {
    console.log('rerendering')
    return (
        <canvas ref={ref} style={{ border: '1px solid red' }}></canvas>
    )
}))
export default Canvas;