import { yupResolver } from '@hookform/resolvers';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '../shared/DateField';

const schema = yup.object().shape({
  orderDate: yup.date().typeError('Invalid Date').required('Required'),
  deliveryDate: yup.date().typeError('Invalid Date').required('Required'),
});

const EditBatchDatesModal = ({ open, data, onSave, onCancel }) => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSave = formData => {
    onSave({ ...data, ...formData });
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Edit Order and Delivery Dates</DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <DateField
                name="orderDate"
                label="Order By"
                defaultValue={data.orderDate}
                register={register}
                errors={errors}
              />
            </Grid>
            <Grid item xs={6}>
              <DateField
                name="deliveryDate"
                label="Delivery On"
                defaultValue={data.deliveryDate}
                register={register}
                errors={errors}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
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
