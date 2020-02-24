import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  active: (props) => ({
    backgroundColor: props.isactive ? 'orange' : '',
    '&:hover': {
      backgroundColor: props.isactive ? 'orange' : '',
    },
  }),
});

const CtlButton = ({ children, ...rest }) => {
  const classes = useStyles(rest);
  console.log(rest);
  return (
    <Button {...rest} className={classes.active}>
      {children}
    </Button>
  );
};

export default CtlButton;
