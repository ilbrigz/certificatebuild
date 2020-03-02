import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({

  active: (props) => ({
    backgroundColor: props.isactive ? '#00adb5' : '',
    color: '#eee',
    color: props.isactive ? '#ffffff' : 'inherit',
    '&:hover': {
      backgroundColor: props.isactive ? '#00adb5' : '',
      color: '#eee',
      color: props.isactive ? '#ffffff' : '',
    },
  }),
});

const CtlButton = ({ children, ...rest }) => {
  const classes = useStyles(rest);
  return (
    <Button {...rest} className={`${classes.active} `}>
      {children}
    </Button>
  );
};

export default CtlButton;
