import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CompactPicker } from 'react-color';
import { NativeSelect, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import CtlButton from '../common/CtlButton';

import {
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaSortNumericUp,
  FaFont,
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

const useStyles = makeStyles(theme => ({
  boxStyle: {
    display: 'inline-block'
  },
  picker: {
    display: 'inline-block',
    position: 'relative'
  }

}));


const TopControls = () => {
  const classes = useStyles()
  const [showPicker, setShowPicker] = useState(false);
  const { selectedObject, fabricRef, jexcelRef } = React.useContext(AppContext);
  const {
    toggleProperty,
    onSetFontSize,
    alignHorizotal,
    alignVertical,
    sendForward,
    sendBackward,
    setFabricProperty,
    onRemove,
    onColorChange,
  } = useControlHanders();

  const onGeneratePdf = () => {
    generatePdf({ fabricRef, jexcelRef });
  };
  return (
    <>
      <div style={{ minHeight: '31px' }}>
        <ButtonGroup disabled={(!selectedObject.type || selectedObject.type === 'image') ? true : false}>
          <CtlButton
            variant="outlined"
            data-tip="Text Align Left"
            onClick={() => setFabricProperty('textAlign', 'left')}
            isactive={selectedObject.textAlign === 'left' ? 1 : 0}
          >
            <FaAlignLeft />
          </CtlButton>
          <CtlButton
            variant="outlined"
            data-tip="Text Align Center"
            onClick={() => setFabricProperty('textAlign', 'center')}
            isactive={selectedObject.textAlign === 'center' ? 1 : 0}
          >
            <FaAlignCenter />
          </CtlButton>
          <CtlButton
            variant="outlined"
            data-tip="Text Align Right"
            onClick={() => setFabricProperty('textAlign', 'right')}
            isactive={selectedObject.textAlign === 'right' ? 1 : 0}
          >
            <FaAlignRight />
          </CtlButton>
        </ButtonGroup>
        <ButtonGroup disabled={(!selectedObject.type || selectedObject.type === 'image') ? true : false}>
          <CtlButton
            variant="outlined"
            onClick={() => {
              toggleProperty('fontStyle', 'italic', 'normal');
            }}
            isactive={selectedObject.fontStyle === 'italic' ? 1 : 0}
            data-tip="Italize Text"
          >
            <MdFormatItalic />
          </CtlButton>
          <CtlButton
            variant="outlined"
            onClick={() => {
              toggleProperty('fontWeight', 'bold', 'normal');
            }}
            isactive={selectedObject.fontWeight === 'bold' ? 1 : 0}
            data-tip="Bold Text"
          >
            <MdFormatBold />
          </CtlButton>
          <CtlButton
            variant="outlined"
            onClick={() => {
              toggleProperty('underline');
            }}
            isactive={selectedObject.underline ? 1 : 0}
            data-tip="Underline Text"
          >
            <MdFormatUnderlined />
          </CtlButton>
        </ButtonGroup>
        <ButtonGroup disabled={!selectedObject.type ? true : false}>
          <CtlButton
            variant="outlined"
            data-tip="Center Horizontally"
            onClick={alignHorizotal}
          >
            <MdBorderVertical />
          </CtlButton>

          <CtlButton
            variant="outlined"
            data-tip="Center Horizontally"
            onClick={alignVertical}
          >
            <MdBorderHorizontal />
          </CtlButton>
          <CtlButton
            variant="outlined"
            data-tip="Send Forward"
            onClick={sendForward}
          >
            <FaSortNumericUp />
          </CtlButton>
          <CtlButton
            variant="outlined"
            data-tip="Send Backward"
            onClick={sendBackward}
          >
            <FaSortNumericDown />
          </CtlButton>
          <CtlButton
            variant="outlined"
            onClick={onRemove}
            data-tip="Delete Selected Item"
          >
            <MdClose />
          </CtlButton>
          {/* <Box className={classes.picker}> */}
          <>
            <Button disabled={(!selectedObject.type || selectedObject.type === 'image') ? true : false} variant="outlined" onClick={() => setShowPicker(!showPicker)}>
              <AiOutlineFontColors fill={(!selectedObject.type || selectedObject.type === 'image') ? 'gray' : selectedObject.fill} />
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
          </>
          {/* </Box> */}
        </ButtonGroup>
        <label className="myLabel">
          <span>
            <AiOutlineFontSize fill={(!selectedObject.type || selectedObject.type === 'image') ? 'gray' : "inherit"} />
          </span>
          <input
            type="number"
            name="quantity"
            defaultValue={selectedObject.fontSize || 30}
            key={selectedObject.fontSize || 30}
            style={{ color: (!selectedObject.type || selectedObject.type === 'image') ? 'gray' : "inherit" }}
            min="10"
            max="80"
            onChange={onSetFontSize}
          />

        </label>
        {/* <Box className={classes.boxStyle}> */}
        <>
          <FaFont fill={(!selectedObject.type || selectedObject.type === 'image') ? 'gray' : "inherit"} />
          <NativeSelect
            disabled={(!selectedObject.type || selectedObject.type === 'image') ? true : false}
            value={20}
            onChange={() => { }}
            name="age"
            inputProps={{ 'aria-label': 'age' }} >
            <option value={10}>Ten</option>
            <option value={20}>Twenty</option>
            <option value={30}>Thirty</option>
          </NativeSelect>
        </>
        {/* </Box> */}

        <ReactTooltip />

      </div>
    </>
  );
};

export default TopControls;
