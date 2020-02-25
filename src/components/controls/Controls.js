import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CompactPicker } from 'react-color';
import { NativeSelect, Grid, FormControl } from '@material-ui/core'


import CtlButton from '../common/CtlButton';

import {
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaSortNumericUp,
  FaSortNumericDown,
} from 'react-icons/fa';

import {
  MdBorderVertical,
  MdBorderHorizontal,
  MdFormatItalic,
  MdFormatBold,
  MdFormatUnderlined,
  MdClose,
} from 'react-icons/md';
import { AiOutlineFontColors } from 'react-icons/ai';
import { AiOutlineFontSize } from 'react-icons/ai';
import { AppContext } from '../../context';
import useControlHanders from './useControlHanders';
import generatePdf from '../../modules/pdfmake.module';

const Controls = () => {
  const [showPicker, setShowPicker] = useState(false);
  const { selectedObject, fabricRef, jexcelRef } = React.useContext(AppContext);
  const {
    insertText,
    onImageUpload,
    toggleProperty,
    alignHorizotal,
    alignVertical,
    sendForward,
    sendBackward,
    onSetFontSize,
    setFabricProperty,
    onRemove,
    logCanvas,
    testing,
    onColorChange,
  } = useControlHanders();

  const onGeneratePdf = () => {
    generatePdf({ fabricRef, jexcelRef });
  };

  return (
    <>
      <div style={{ minHeight: '31px' }}>
        {!!selectedObject.type && (
          <>
            <ButtonGroup>
              <CtlButton
                variant="outlined"
                data-tip="Text Align Left"
                onClick={() => setFabricProperty('textAlign', 'left')}
                isactive={selectedObject.textAlign === 'left' ? 1 : 0}
              >
                <FaAlignLeft />
              </CtlButton>
              <Button
                variant="outlined"
                data-tip="Text Align Center"
                onClick={() => setFabricProperty('textAlign', 'center')}
                className={
                  selectedObject.textAlign === 'center' ? 'orange' : ''
                }
              >
                <FaAlignCenter />
              </Button>
              <Button
                variant="outlined"
                data-tip="Text Align Right"
                onClick={() => setFabricProperty('textAlign', 'right')}
                className={selectedObject.textAlign === 'right' ? 'orange' : ''}
              >
                <FaAlignRight />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                variant="outlined"
                onClick={() => {
                  toggleProperty('fontStyle', 'italic', 'normal');
                }}
                className={
                  selectedObject.fontStyle === 'italic' ? 'orange' : ''
                }
                data-tip="Italize Text"
              >
                <MdFormatItalic />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  toggleProperty('fontWeight', 'bold', 'normal');
                }}
                className={selectedObject.fontWeight === 'bold' ? 'orange' : ''}
                data-tip="Bold Text"
              >
                <MdFormatBold />
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  toggleProperty('underline');
                }}
                className={selectedObject.underline ? 'orange' : ''}
                data-tip="Underline Text"
              >
                <MdFormatUnderlined />
              </Button>
            </ButtonGroup>
            <Button
              variant="outlined"
              data-tip="Center Horizontally"
              onClick={alignHorizotal}
            >
              <MdBorderVertical />
            </Button>

            <Button
              variant="outlined"
              data-tip="Center Horizontally"
              onClick={alignVertical}
            >
              <MdBorderHorizontal />
            </Button>
            <Button
              variant="outlined"
              data-tip="Send Forward"
              onClick={sendForward}
            >
              <FaSortNumericUp />
            </Button>
            <Button
              variant="outlined"
              data-tip="Send Backward"
              onClick={sendBackward}
            >
              <FaSortNumericDown />
            </Button>
            <Button
              variant="outlined"
              onClick={onRemove}
              data-tip="Delete Selected Item"
            >
              <MdClose />
            </Button>
            <ReactTooltip />
          </>
        )}
        <Button variant="outlined" onClick={logCanvas}>
          LOG JSON
        </Button>
        <Button variant="outlined" onClick={onGeneratePdf}>
          download
        </Button>
        <Button variant="outlined" onClick={testing}>
          testing
        </Button>
      </div>

      <label className="myLabel">
        <input
          type="file"
          id="file"
          onChange={onImageUpload}
          accept="image/*"
        />
        <span>Upload Image</span>
      </label>
      <label className="myLabel">
        <input
          type="number"
          name="quantity"
          defaultValue={selectedObject.fontSize || 30}
          key={selectedObject.fontSize || 30}
          min="10"
          max="80"
          onChange={onSetFontSize}
        />
        <span>
          <AiOutlineFontSize />
        </span>
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
      <div style={{ display: 'inline-block', position: 'relative' }}>
        <Button variant="outlined" onClick={() => setShowPicker(!showPicker)}>
          <AiOutlineFontColors fill={selectedObject.fill || 'white'} />
        </Button>
        {showPicker ? (
          <div
            style={{ position: 'absolute', zIndex: 999, top: 0, left: '100%' }}
          >
            <div
              onClick={() => setShowPicker(false)}
              style={{
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              }}
            ></div>
            <CompactPicker
              color={selectedObject.fill || '#000000'}
              onChangeComplete={onColorChange}
            />
          </div>
        ) : null}
        <Button variant="outlined" variant="outlined">
          test
        </Button>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <AiOutlineFontSize />
          </Grid>
          <Grid item>
            <NativeSelect
              value={20}
              onChange={() => { }}
              name="age"
              inputProps={{ 'aria-label': 'age' }} >
              <option value={10}>Ten</option>
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </NativeSelect>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Controls;
