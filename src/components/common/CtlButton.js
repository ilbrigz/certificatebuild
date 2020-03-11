import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  btn: {
    color: '#ffffff',
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#f0ece2',
    '&:hover': { backgroundColor: '#f0ece2' },
    '& svg': { fill: 'black' },
    '&:disabled': { backgroundColor: 'gray' },
    '&:disabled svg': { fill: '#gray' },
  },
  active: (props) => ({
    backgroundColor: props.isactive ? '#00adb5' : '',
    color: '#eee',
    color: props.isactive ? '#ffffff' : 'inherit',
    '&:hover': {
      backgroundColor: props.isactive ? '#00adb5' : '',
      color: '#eee',
      color: props.isactive ? '#ffffff' : '',
    },
    // '& svg': {
    //   fill: '#f0ece2',
    // },
  }),
});

const CtlButton = ({ children, ...rest }) => {
  const classes = useStyles(rest);
  return (
    <Button {...rest} className={` ${classes.active} ${classes.btn} `}>
      {children}
    </Button>
  );
};

export default CtlButton;
