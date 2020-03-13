import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Button, ButtonGroup, Box, makeStyles } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { AppContext } from '../../context';
import useControlHanders from './useControlHanders';
import { downloadPdf, previewPdf } from '../../modules/pdfmake.module';
import { FaFileDownload } from 'react-icons/fa';
import { IoMdOpen } from 'react-icons/io';

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: '#202125',
    // position: 'relative',
  },
  fabPreview: {
    zIndex: 99999,
    position: 'fixed',
    right: '20px',
    bottom: '120px',
  },
  fabDownload: {
    zIndex: 99999,
    position: 'fixed',
    right: '20px',
    bottom: '40px',
  },
}));
const BottomControls = () => {
  const classes = useStyles();
  const { fabricRef, jexcelRef } = React.useContext(AppContext);
  const { insertText, onImageUpload, logCanvas, testing } = useControlHanders();

  return (
    <Box className={classes.root}>
      <Fab
        color="primary"
        className={classes.fabPreview}
        onClick={() => previewPdf({ fabricRef, jexcelRef })}
        // onClick={() => console.log(jexcelRef.current.getData())}
      >
        <IoMdOpen size="2em" color="white" />
      </Fab>
      <Fab
        color="secondary"
        className={classes.fabDownload}
        onClick={() => downloadPdf({ fabricRef, jexcelRef })}
      >
        <FaFileDownload size="2em" color="white" />
      </Fab>
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
        onClick={() => {
          previewPdf({ fabricRef, jexcelRef });
        }}
      >
        PreviewPdf
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          downloadPdf({ fabricRef, jexcelRef });
        }}
      >
        download
      </Button>

      <Button variant="outlined" onClick={logCanvas}>
        LOG JSON
      </Button>
      {/*
      <Button
        variant="outlined"
        onClick={() => {
          console.log(fabricRef.current.toSVG())
        }}
      >
        testing
      </Button> */}
    </Box>
  );
};

export default BottomControls;
