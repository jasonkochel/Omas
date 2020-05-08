import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  RequireNewPassword,
  SignUp,
  VerifyContact,
  withAuthenticator,
} from 'aws-amplify-react';
import React from 'react';
import App from './App';
import CustomSignIn from './components/CustomSignIn';

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
  <ForgotPassword usernameAttributes="email" />,
  <RequireNewPassword />,
]);
