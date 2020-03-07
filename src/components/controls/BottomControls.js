import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Button, ButtonGroup } from '@material-ui/core';

import { AppContext } from '../../context';
import useControlHanders from './useControlHanders';
import { generatePdf, generatePdfUsingSvg } from '../../modules/pdfmake.module';

const BottomControls = () => {
  const { selectedObject, fabricRef, jexcelRef } = React.useContext(AppContext);
  const { insertText, onImageUpload, logCanvas, testing } = useControlHanders();

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
        // place="bottom"
        delayHide={1000}
        effect="solid"
        clickable={true}
      >
        <ButtonGroup>
          <Button variant="contained" size="small" onClick={insertText}>
            TEXT
          </Button>
          <Button variant="contained" size="small" onClick={insertText}>
            TEXTBOX
          </Button>
        </ButtonGroup>
      </ReactTooltip>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          generatePdf({ fabricRef, jexcelRef });
        }}
      >
        download
      </Button>

      <Button
        variant="outlined"
        onClick={() => generatePdfUsingSvg({ fabricRef, jexcelRef })}
        variant="outlined"
      >
        GenerateBySVG
      </Button>
      <Button variant="outlined" onClick={logCanvas}>
        LOG JSON
      </Button>

      <Button
        variant="outlined"
        onClick={() => {
          console.log(fabricRef.current.toSVG())
        }}
      >
        testing
      </Button>
    </>
  );
};

export default BottomControls;
