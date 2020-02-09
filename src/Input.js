import React, { useState, useEffect } from 'react'

const Input = ({ canvas }) => {
    const [fontSize, setFontSize] = useState(16)
    useEffect(() => {
        console.log('testsetse', canvas)
        if (canvas) canvas.on('selection:created', (e) => {
            alert('hallo')
            if (e.target.fontSize) {
                setFontSize(e.target.fontSize)
            }
        })
    }, [])

    const setFont = () => {
        console.log(canvas)
    }

    return (<input type="number" name="quantity" defaultValue={fontSize} key={fontSize} min="10" max="50" onChange={setFont} />)
}

export default Input