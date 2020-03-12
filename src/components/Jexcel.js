import React, { useRef, useEffect } from 'react';
import { AppContext } from '../context';
import { Fab, Grow, makeStyles, Backdrop } from '@material-ui/core';

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
    position: 'fixed',
    top: 20,
    left: 20,
  },
  modal: {
    visibility: "visible !important",
    zIndex: theme.zIndex.drawer + 2,
    position: 'fixed',
    top: 20,
    left: 20
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));
function getModalStyle() {
  const top = 50 + Math.round(Math.random() * 20) - 10;
  const left = 50 + Math.round(Math.random() * 20) - 10;

  return {
    // top: `${top}%`,
    // left: `${left}%`,
    // transform: `translate(-${top}%, -${left}%)`,
  };
}

const Jexcel = () => {
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const divRef = useRef(null);
  const { fabricRef, jexcelRef } = React.useContext(AppContext);

  const classes = useStyles();
  useEffect(() => { jexcelRef.current = jexcelInit({ fabricRef, divRef }) }, [])
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Fab onClick={() => setOpen(true)} className={classes.fabJexcelOpen}>
        Open
      </Fab>
      <Backdrop open={true} onClick={handleClose}>
        <Grow
          // aria-labelledby="simple-modal-title"
          // aria-describedby="simple-modal-description"
          in={open}
          className={classes.modal}
        // style={{ ...(!open && { display: 'none' }) }}
        >
          {/* <div style={modalStyle} className={classes.paper}> */}
          <div ref={divRef}></div>
          {/* <SimpleModal /> */}
          {/* </div> */}
        </Grow>
      </Backdrop>



    </>
  );
};

export default Jexcel;
