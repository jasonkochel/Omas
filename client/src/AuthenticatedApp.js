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
    },
    {
      label: 'Full Name',
      key: 'name',
      required: true,
      displayOrder: 2,
    },
    {
      label: 'Phone Number',
      key: 'phone_number',
      required: true,
      displayOrder: 3,
      type: 'tel',
    },
    {
      label: 'Create a Password',
      key: 'password',
      required: true,
      displayOrder: 4,
      type: 'password',
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
