import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

export default function AlertDialog({ open, handleConfirm, handleCancel }) {
    return (
        <Dialog
            open={true}
            onClose={handleConfirm}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
                <Alert variant="filled" severity="success">
                    This is a success alert — check it out!
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    Disagree
          </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                    Agree
          </Button>
            </DialogActions>
        </Dialog>

    );
}