import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const EditItemModal = ({ data, mode, onEditingApproved, onEditingCanceled }) => {
  const [open, setOpen] = useState(true);
  const { register, handleSubmit } = useForm({
    defaultValues: { ...data, price: Number(data.price).toFixed(2) },
  });

  const handleCancel = () => {
    setOpen(false);
    onEditingCanceled(mode, data);
  };

  // TODO: combine these into a single success handler

  const handleUpdate = formData => {
    const newData = { ...formData, catalogId: data.catalogId };
    setOpen(false);
    onEditingApproved(mode, newData, data);
  };

  const handleDelete = () => {
    setOpen(false);
    onEditingApproved(mode, null, data);
  };

  const dialogTitle = mode === 'delete' ? 'Delete Item?' : 'Enter Item Details';

  return (
    <Dialog open={open} onClose={handleCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        {mode === 'delete' ? (
          <DialogContentText>Are you sure you want to delete {data.name}?</DialogContentText>
        ) : (
          <form>
            <TextField
              type="text"
              name="sku"
              label="SKU"
              inputRef={register({ required: true, maxLength: 10 })}
            />
            <TextField
              type="text"
              name="name"
              label="Name"
              inputRef={register({ required: true, maxLength: 200 })}
            />
            <TextField
              type="number"
              name="price"
              label="Price"
              defaultValue={Number(data.price).toFixed(2)}
              inputRef={register({ required: true, maxLength: 9 })}
            />
            <TextField
              type="text"
              name="pricePer"
              label="Price Per"
              inputRef={register({ required: true })}
            />
            <TextField
              type="text"
              name="orderPer"
              label="Order Per"
              inputRef={register({ required: true })}
            />
            <TextField
              type="number"
              name="weight"
              label="Weight"
              inputRef={register({ required: true })}
            />
            <TextField
              type="number"
              name="multiplier"
              label="Multiplier"
              inputRef={register({ required: true })}
            />
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        {(mode === 'update' || mode === 'add') && (
          <Button onClick={handleSubmit(handleUpdate)} color="primary">
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
