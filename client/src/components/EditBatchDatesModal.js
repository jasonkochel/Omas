import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import fns from '../fns';

const EditBatchDatesModal = ({ open, data, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    errors,
  } = useForm(); /*{
    defaultValues: {
      orderDate: fns.formatDate(data.orderDate, 'yyyy-MM-dd'),
      deliveryDate: fns.formatDate(data.deliveryDate, 'yyyy-MM-dd'),
    },
  });*/

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = formData => {
    if (Object.keys(errors).length > 0) {
      // TODO: check form errors (form will not submit if there are errors)
    }

    onSave({ ...data, ...formData });
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Edit Order and Delivery Dates</DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <TextField
                type="date"
                name="orderDate"
                label="Order By"
                variant="filled"
                margin="normal"
                defaultValue={fns.formatDate(data.orderDate, 'yyyy-MM-dd')}
                inputRef={register({ required: true, maxLength: 10 })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="date"
                name="deliveryDate"
                label="Delivery On"
                variant="filled"
                margin="normal"
                defaultValue={fns.formatDate(data.deliveryDate, 'yyyy-MM-dd')}
                inputRef={register({ required: true, maxLength: 10 })}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleSave)} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBatchDatesModal;
