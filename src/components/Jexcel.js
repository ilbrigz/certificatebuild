import React, { useRef, useEffect } from 'react';
import { AppContext } from '../context';
import { Fab, Modal, makeStyles } from '@material-ui/core';

import jexcelInit from '../modules/Jexcel.module';
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  fabJexcelOpen: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
}));
function getModalStyle() {
  const top = 50 + Math.round(Math.random() * 20) - 10;
  const left = 50 + Math.round(Math.random() * 20) - 10;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Jexcel = () => {
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const divRef = useRef(null);
  const { fabricRef, jexcelRef } = React.useContext(AppContext);

  const classes = useStyles();
  const initJexcel = () => {
    jexcelRef.current = jexcelInit({ fabricRef, id: 'jexceldiv' });
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Fab onClick={() => setOpen(true)} className={classes.fabJexcelOpen}>
        Open
      </Fab>
      <Modal
        onRendered={initJexcel}
        keepMounted={true}
        // aria-labelledby="simple-modal-title"
        // aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <div id="jexceldiv"></div>
          {/* <SimpleModal /> */}
        </div>
      </Modal>
    </>
  );
};

export default Jexcel;
