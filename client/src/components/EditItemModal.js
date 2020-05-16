import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { useState } from 'react';

const EditItemModal = ({ data, mode, onAdd, onUpdate, onDelete, onEditingCanceled }) => {
  const [open, setOpen] = useState(true);

  const handleCancel = () => {
    setOpen(false);
    onEditingCanceled(mode, data);
  };

  const handleUpdate = () => {
    setOpen(false);
    onUpdate(data); // TODO make this the newly edited data
  };

  const handleDelete = () => {
    setOpen(false);
    onDelete(data);
  };

  const dialogTitle = mode === 'delete' ? 'Delete Item?' : 'Enter Item Details';

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        {mode === 'delete' ? (
          <DialogContentText>Are you sure you want to delete {data.name}?</DialogContentText>
        ) : (
          <DialogContentText>Build the form here to edit {data.name}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {mode === 'update' && (
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        )}
        {mode === 'delete' && (
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;
