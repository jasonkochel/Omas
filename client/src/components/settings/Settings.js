import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { convertToRaw } from 'draft-js';
import MUIRichTextEditor from 'mui-rte';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import * as yup from 'yup';
import api from '../../api';
import fns from '../../fns';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px',
    maxWidth: '1100px',
  },
  formLabel: {
    paddingTop: '15px',
  },
  editorContainer: {
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '250px',
    borderWidth: '1px',
    borderColor: '#c4c4c4',
    borderRadius: '4px',
  },
}));

const schema = yup.object().shape({
  taxRate: yup
    .number()
    .typeError('Invalid Number')
    .required('Required')
    .test({
      name: 'notFractional',
      message: 'Enter tax rate like 7% not 0.07',
      test: value => value === 0.0 || value >= 1.0,
    }),
  shippingRate: yup.number().typeError('Invalid Number').required('Required'),
});

const Settings = () => {
  const classes = useStyles();

  const { register, handleSubmit, errors, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { isLoading, data } = useQuery('Settings', api.getSettings);

  const handleEditorChange = editorState => {
    setValue('welcomeMessage', JSON.stringify(convertToRaw(editorState.getCurrentContent())));
  };

  const handleSave = formData => {
    api.updateSettings(formData);
  };

  if (isLoading) return null;

  return (
    <Paper className={classes.paper}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Settings</Typography>
          </Grid>
          <Grid item xs={2}>
            <InputLabel className={classes.formLabel} htmlFor="taxRate">
              Tax Rate
            </InputLabel>
          </Grid>
          <Grid item xs={10}>
            <TextField
              type="number"
              variant="outlined"
              name="taxRate"
              id="taxRate"
              defaultValue={fns.formatNumber(data.taxRate, 2)}
              inputRef={register}
              error={!!errors.taxRate}
              helperText={errors.taxRate?.message}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <InputLabel className={classes.formLabel} htmlFor="shippingRate">
              Shipping Rate
            </InputLabel>
          </Grid>
          <Grid item xs={10}>
            <TextField
              type="number"
              variant="outlined"
              name="shippingRate"
              id="shippingRate"
              defaultValue={fns.formatNumber(data.shippingRate, 2)}
              inputRef={register}
              error={!!errors.shippingRate}
              helperText={errors.shippingRate?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: <InputAdornment position="end">per lb.</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <InputLabel className={classes.formLabel} htmlFor="welcomePage">
              Welcome Page Text
            </InputLabel>
          </Grid>
          <Grid item xs={10}>
            <div className={classes.editorContainer}>
              <input type="hidden" name="welcomeMessage" ref={register} />
              <MUIRichTextEditor
                id="welcomeEditor"
                defaultValue={data.welcomeMessage}
                onChange={handleEditorChange}
                controls={[
                  'title',
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'highlight',
                  'undo',
                  'redo',
                  'link',
                  'media',
                  'numberList',
                  'bulletList',
                  'clear',
                ]}
              />
            </div>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Button color="primary" variant="contained" onClick={handleSubmit(handleSave)}>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Settings;
