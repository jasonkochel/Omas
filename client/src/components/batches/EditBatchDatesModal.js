import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '../shared/DateField';
import fns from './../../fns';

const schema = yup.object().shape({
  orderDate: yup.date().typeError('Invalid Date').required('Required'),
  deliveryDate: yup
    .date()
    .typeError('Invalid Date')
    .required('Required')
    .min(yup.ref('orderDate'), 'Must be after Order Date'),
});

const EditBatchDatesModal = ({ open, data, onSave, onCancel }) => {
  const { register, handleSubmit, errors, watch, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  // this is needed to force re-validation when *either* field value is changed
  const watches = watch();

  useEffect(() => {
    trigger();
  }, [data.batchId, watches.orderDate, watches.deliveryDate, trigger]);
  // end

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
            <Grid item xs={12}>
              This order will use the current tax rate of {fns.formatNumber(data.taxRate, 2)}% and
              shipping rate of {fns.formatCurrency(data.shippingRate)}/lb.{' '}
              {data.batchId === 0 &&
                'If you want to change these, click Cancel, go to Settings, and change them there before opening a new order cycle.'}
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
