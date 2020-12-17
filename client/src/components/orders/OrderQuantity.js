import { IconButton, InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  shadedInput: {
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.success.light,
    },
    '& .MuiInputBase-input': {
      textAlign: 'center',
    },
  },
}));

const quantityToDisplayQty = quantity => (quantity && quantity > 0 ? quantity.toString() : '');

const OrderQuantity = ({ item, initialQuantity, onChangeQuantity }) => {
  const classes = useStyles();

  const [quantity, setQuantity] = useState(initialQuantity);

  const handleIncrement = delta => {
    const oldQuantity = quantity ? Number.parseInt(quantity) : 0;
    const newQuantity = oldQuantity + delta < 0 ? 0 : oldQuantity + delta;
    handleChangeQuantity(newQuantity);
  };

  const handleManualInput = e => {
    let newQuantity = Number.parseInt(e.target.value, 10);
    if (isNaN(newQuantity)) {
      newQuantity = 0;
    }
    handleChangeQuantity(newQuantity);
  };

  const handleChangeQuantity = newQuantity => {
    setQuantity(newQuantity);
    onChangeQuantity(item, newQuantity);
  };

  return (
    <TextField
      type="number"
      variant="outlined"
      className={clsx(quantity > 0 && classes.shadedInput)}
      value={quantityToDisplayQty(quantity)}
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

export default React.memo(OrderQuantity);
