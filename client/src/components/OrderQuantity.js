import { IconButton, InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import React, { useState } from 'react';
import api from '../api/api';

const useStyles = makeStyles(theme => ({
  shadedInput: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.success.light,
    },
  },
}));

const OrderQuantity = ({ item }) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState('');

  const handleIncrement = delta => {
    const oldQuantity = quantity === '' ? 0 : Number.parseInt(quantity);
    const newQuantity = oldQuantity + delta < 0 ? 0 : oldQuantity + delta;
    handleUpdateQuantity(newQuantity);
  };

  const handleManualInput = e => {
    let newQuantity = Number.parseInt(e.target.value, 10);
    if (isNaN(newQuantity)) {
      newQuantity = 0;
    }

    handleUpdateQuantity(newQuantity);
  };

  const handleUpdateQuantity = newQuantity => {
    const stringQuantity = newQuantity === 0 ? '' : newQuantity.toString();
    setQuantity(stringQuantity);
    api.updateOrder(item.catalogId, newQuantity);
  };

  return (
    <TextField
      type="number"
      variant="outlined"
      className={quantity > 0 ? classes.shadedInput : ''}
      value={quantity}
      onChange={handleManualInput}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={() => handleIncrement(-1)}>
              <Remove fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => handleIncrement(1)}>
              <Add fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default OrderQuantity;
