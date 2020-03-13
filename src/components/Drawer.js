import React from 'react';
import { Fab, Drawer, Typography, makeStyles } from '@material-ui/core';

import Jexcel from './Jexcel';
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
    bottom: 40,
    left: 20,
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    visibility: 'visible !important',
    maxWidth: '500px',
    width: '400px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    visibility: 'visible !important',
    maxWidth: '500px',
    width: '400px',
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    '& table': {
      margin: '0 auto',
    },
  },
}));

const MyDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  return (
    <>
      <Fab
        variant="extended"
        onClick={() => setOpen(!open)}
        className={classes.fabJexcelOpen}
      >
        Data Input
      </Fab>
      <Drawer
        anchor="left"
        variant="persistent"
        open={open}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Typography color="primary">Dynamic Data</Typography>
        <Jexcel />
      </Drawer>
    </>
  );
};

export default MyDrawer;
