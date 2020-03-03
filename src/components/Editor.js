import React, { useRef, } from 'react';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Paper } from '@material-ui/core'

import TopControls from './controls/TopControls';
import BottomControls from './controls/BottomControls';
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
            <TopControls />
            <div style={{ display: 'flex' }}>
                <Paper square elevation={3}>
                    <Canvas />
                </Paper>
                <Jexcel />
            </div>
            <BottomControls />
        </>
    );
}
