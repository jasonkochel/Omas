import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const EditItemModal = ({ data, mode, onEditingApproved, onEditingCanceled }) => {
  const [open, setOpen] = useState(true);

  const defaultValues = data
    ? { ...data, price: Number(data.price).toFixed(2) }
    : { price: '0.00', multiplier: 1.0 };

  const [useMultiplier, setUseMultiplier] = useState(defaultValues.multiplier !== 1.0);

  const { register, handleSubmit } = useForm({
    defaultValues: defaultValues,
  });

  const handleCancel = () => {
    setOpen(false);
    onEditingCanceled(mode, data);
  };

  // TODO: combine these into a single success handler

  const handleUpdate = formData => {
    const newData = { ...formData, catalogId: data?.catalogId };
    setOpen(false);
    onEditingApproved(mode, newData, data);
  };

  const handleDelete = () => {
    setOpen(false);
    onEditingApproved(mode, null, data);
  };

  const dialogTitle = mode === 'delete' ? 'Delete Item?' : 'Enter Item Details';

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md">
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {mode === 'delete' ? (
          <DialogContentText>Are you sure you want to delete {data.name}?</DialogContentText>
        ) : (
          <form>
            <Grid container spacing={0}>
              <Grid item xs={4}>
                <TextField
                  type="text"
                  name="sku"
                  label="SKU"
                  variant="filled"
                  margin="normal"
                  inputRef={register({ required: true, maxLength: 10 })}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  type="text"
                  name="name"
                  label="Name"
                  margin="normal"
                  variant="filled"
                  fullWidth={true}
                  inputRef={register({ required: true, maxLength: 200 })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  name="price"
                  label="Price"
                  margin="normal"
                  variant="filled"
                  inputRef={register({ required: true, maxLength: 9 })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="text"
                  name="pricePer"
                  label="Per"
                  helperText="(each, case, etc)"
                  margin="normal"
                  variant="filled"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  name="weight"
                  label="Weight (lbs)"
                  margin="normal"
                  variant="filled"
                  inputRef={register({ required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox checked={useMultiplier} onChange={() => setUseMultiplier(x => !x)} />
                  }
                  label="This item is priced by one unit (e.g. lbs) but ordered by another (e.g. each)"
                />
              </Grid>
              {useMultiplier && (
                <Grid item xs={4}>
                  <TextField
                    type="text"
                    name="orderPer"
                    label="Ordered in Units Of"
                    margin="normal"
                    variant="filled"
                    inputRef={register({ required: true })}
                  />
                </Grid>
              )}
              {useMultiplier && (
                <Grid item xs={8}>
                  <TextField
                    type="number"
                    name="multiplier"
                    label="Multiplier"
                    helperText="(The amount to multiply the price by, for each 'order-per' unit)"
                    margin="normal"
                    variant="filled"
                    inputRef={register({ required: true })}
                  />
                </Grid>
              )}
            </Grid>
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
