import { yupResolver } from '@hookform/resolvers';
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
import * as yup from 'yup';
import fns from '../../fns';

yup.addMethod(yup.number, 'decimal', fns.validateDecimal);

const schema = yup.object().shape({
  sku: yup.string().max(10, 'Max 10 characters').required('Required'),
  name: yup.string().max(200, 'Max 200 characters').required('Required'),
  price: yup.number().decimal(9, 2).typeError('Invalid Number').required('Required'),
  pricePer: yup.string().max(10, 'Max 10 characters').required('Required'),
  weight: yup.number().decimal(7, 2).typeError('Invalid Number').required('Required'),
  useMultiplier: yup.boolean(),
  orderPer: yup
    .string()
    .max(10, 'Max 10 characters')
    .when('useMultiplier', {
      is: true,
      then: yup.string().required('Required'),
      otherwise: yup.string().notRequired(),
    }),
  multiplier: yup
    .number()
    .typeError('Invalid Number')
    .when('useMultiplier', {
      is: true,
      then: yup.number().decimal(5, 2).required('Required'),
      otherwise: yup.number().notRequired(),
    }),
});

const EditItemModal = ({ data, mode, onEditingApproved, onEditingCanceled }) => {
  const [open, setOpen] = useState(true);

  const defaultValues = data
    ? { ...data, price: Number(data.price).toFixed(2), useMultiplier: data.multiplier !== 1.0 }
    : { price: '0.00', multiplier: 1.0, useMultiplier: false };

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const watchUseMultiplier = watch('useMultiplier');

  const handleCancel = () => {
    setOpen(false);
    onEditingCanceled(mode, data);
  };

  const handleAddOrUpdate = formData => {
    // "defaultValues" contains entire record, not just form fields, so include
    // all of those fields and overwrite the applicable ones with "formData"
    const newData = { ...defaultValues, ...formData };

    if (!watchUseMultiplier) {
      newData.multiplier = 1.0;
      newData.orderPer = newData.pricePer;
    }

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
                  inputRef={register}
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
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
                  inputRef={register}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  name="price"
                  label="Price"
                  margin="normal"
                  variant="filled"
                  inputRef={register}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="text"
                  name="pricePer"
                  label="Per"
                  helperText={
                    (!!errors.pricePer ? errors.pricePer.message + ' ' : '') + '(each, case, etc)'
                  }
                  margin="normal"
                  variant="filled"
                  inputRef={register}
                  error={!!errors.pricePer}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  name="weight"
                  label="Weight (lbs)"
                  margin="normal"
                  variant="filled"
                  inputRef={register}
                  error={!!errors.weight}
                  helperText={errors.weight?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="useMultiplier" inputRef={register} />}
                  label="This item is priced by one unit (e.g. lbs) but ordered by another (e.g. each)"
                />
              </Grid>
              {watchUseMultiplier && (
                <Grid item xs={4}>
                  <TextField
                    type="text"
                    name="orderPer"
                    label="Ordered in Units Of"
                    margin="normal"
                    variant="filled"
                    inputRef={register}
                    error={!!errors.orderPer}
                    helperText={errors.orderPer?.message}
                  />
                </Grid>
              )}
              {watchUseMultiplier && (
                <Grid item xs={8}>
                  <TextField
                    type="number"
                    name="multiplier"
                    label="Multiplier"
                    helperText={
                      (!!errors.multiplier ? errors.multiplier.message + ' ' : '') +
                      "(The amount to multiply the price by, for each 'order-per' unit)"
                    }
                    margin="normal"
                    variant="filled"
                    inputRef={register}
                    error={!!errors.multiplier}
                  />
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        {(mode === 'update' || mode === 'add') && (
          <Button onClick={handleSubmit(handleAddOrUpdate)} variant="contained" color="primary">
            Save
          </Button>
        )}
        {mode === 'delete' && (
          <Button onClick={handleDelete} variant="contained" color="primary">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;
