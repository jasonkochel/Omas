import Authenticator from '@jasonkochel/react-cognito-auth';
import { Card, CardContent, Container, makeStyles } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import api from '../../api';

const signupFields = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    required: true,
  },
];

const useStyles = makeStyles(theme => ({
  helpText: {
    textAlign: 'center',
  },
}));

const Login = ({ onSignIn }) => {
  const classes = useStyles();

  const { data: settings } = useQuery('Settings', api.getSettings);

  return (
    <div>
      {settings?.loginMessage && (
        <Container maxWidth="md">
          <Card>
            <CardContent className={classes.helpText}>
              <div dangerouslySetInnerHTML={{ __html: settings.loginMessageHtml }} />
            </CardContent>
          </Card>
        </Container>
      )}
      <Authenticator onSignIn={onSignIn} signupFields={signupFields} socialProviders={['Google']} />
    </div>
  );
};

export default Login;
