import React, { useRef, } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import Controls from './controls/Controls';
import Canvas from './Canvas'
import '../App.css';

import Jexcel from './Jexcel'


const Test = React.memo((props) => {
    console.log('rendering test')
    return <p>test</p>

})


pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default function Editor(props) {
    const jexcelDiv = useRef(null);
    console.log('rendering Editor')

    return (
        <>
            <Controls />
            <div style={{ display: 'flex' }}>
                <div>
                    <Canvas />
                </div>
                <Jexcel />
            </div>
        </>
    );
}
