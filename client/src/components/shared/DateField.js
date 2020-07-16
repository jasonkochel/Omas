import { TextField } from '@material-ui/core';
import React from 'react';
import fns from '../../fns';

const DateField = ({ name, label, defaultValue, register, errors }) => (
  <TextField
    type="date"
    name={name}
    label={label}
    variant="filled"
    margin="normal"
    defaultValue={fns.formatDate(defaultValue, 'yyyy-MM-dd')}
    inputRef={register}
    error={!!errors[name]}
    helperText={errors[name]?.message}
  />
);

export default DateField;
