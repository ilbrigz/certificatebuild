import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Button from '@material-ui/core/Button';

import { AiOutlineFontSize } from 'react-icons/ai';
import { AppContext } from '../../context';
import useControlHanders from './useControlHanders';
import generatePdf from '../../modules/pdfmake.module';

const BottomControls = () => {
    const { selectedObject, fabricRef, jexcelRef } = React.useContext(AppContext);
    const {
        insertText,
        onImageUpload,
        logCanvas,
        testing,
    } = useControlHanders();

    const onGeneratePdf = () => {
        generatePdf({ fabricRef, jexcelRef });
    };
    return (
        <>
            <label className="myLabel">
                <input
                    type="file"
                    id="file"
                    onChange={onImageUpload}
                    accept="image/*"
                />
                <span>Upload Image</span>
            </label>

            <Button variant="outlined" data-tip data-for="clickme">
                Insert Editable Text
      </Button>
            <ReactTooltip
                id="clickme"
                place="bottom"
                delayHide={1000}
                effect="solid"
                clickable={true}
            >
                <Button variant="outlined" onClick={insertText}>
                    TEXT
        </Button>
                <Button variant="outlined" onClick={insertText}>
                    TEXTBOX
        </Button>
            </ReactTooltip>

            <Button variant="outlined" variant="outlined">
                test
        </Button>
            <Button variant="outlined" onClick={logCanvas}>
                LOG JSON
        </Button>
            <Button variant="outlined" onClick={onGeneratePdf}>
                download
        </Button>
            <Button variant="outlined" onClick={testing}>
                testing
        </Button>
        </>
    );
};

export default BottomControls;
