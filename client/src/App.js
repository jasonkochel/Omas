import { CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  RequireNewPassword,
  SignUp,
  VerifyContact,
  withAuthenticator,
} from 'aws-amplify-react';
import React, { useState } from 'react';
import './App.css';
import CustomSignIn from './components/CustomSignIn';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 64,
  },
}));

const App = () => {
  const [user, setUser] = useState(null);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <main className={classes.content}>
        <button
          onClick={async () => {
            const user = await Auth.currentAuthenticatedUser();
            setUser(user);
          }}
        >
          Get User Info
        </button>
        <pre style={{ textAlign: 'left' }}>{JSON.stringify(user?.attributes, null, 2)}</pre>

        <Typography paragraph>Lorem ipsum dolor sit amet</Typography>
      </main>
    </div>
  );
};

const signUpConfig = {
  hiddenDefaults: ['username', 'email'],
  signUpFields: [
    {
      label: 'Email',
      key: 'username', // needed for email-as-username
      required: true,
      displayOrder: 1,
      type: 'string',
      custom: false,
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password',
      custom: false,
    },
    {
      label: 'Phone Number',
      key: 'phone_number',
      required: true,
      displayOrder: 3,
      type: 'tel',
      custom: false,
    },
  ],
};

export default withAuthenticator(App, false, [
  <CustomSignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <SignUp signUpConfig={signUpConfig} />,
  <ConfirmSignUp />,
  <ForgotPassword usernameAttributes="Email" />,
  <RequireNewPassword />,
]);
