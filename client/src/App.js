import { Auth } from 'aws-amplify';
import {
  ConfirmSignIn,
  ConfirmSignUp,
  ForgotPassword,
  Link,
  RequireNewPassword,
  SignIn,
  SignUp,
  VerifyContact,
  withAuthenticator,
} from 'aws-amplify-react';
import React, { useState } from 'react';
import styled from 'styled-components';
import './App.css';
import googleButton from './btn_google_signin_dark.png';
import logo from './logo.svg';

const StyledGoogleButton = styled.img`
  width: 200px;
  cursor: pointer;
`;

const GoogleButton = () => (
  <StyledGoogleButton
    src={googleButton}
    alt="Sign In with Google"
    onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
  />
);

class MySignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
  }

  showComponent(theme) {
    return (
      <div className="Form__formContainer___1GA3x">
        <div className="Form__formSection___1PPvW">
          <div className="Section__sectionHeader___2djyg">
            <span className="Section__sectionHeaderContent___1UCqa">Sign in to your account</span>
          </div>
          <div>
            <div>
              <GoogleButton />
            </div>
            <div className="Strike__strike___1XV1b">
              <span className="Strike__strikeContent___10gLb">or</span>
            </div>
          </div>
          <form>
            <div className="Section__sectionBody___ihqqd">
              <div className="Form__formField___38Ikl">
                <div className="Input__inputLabel___3VF0S">Username *</div>
                <input
                  onChange={this.handleInputChange}
                  placeholder="Enter your username"
                  id="username"
                  name="username"
                  key="username"
                  type="text"
                  className="Input__input___3e_bf"
                />
                <div className="Form__formField___38Ikl">
                  <div className="Input__inputLabel___3VF0S">Password *</div>
                  <input
                    onChange={this.handleInputChange}
                    placeholder="Enter your password"
                    type="password"
                    name="password"
                    id="password"
                    key="password"
                    className="Input__input___3e_bf"
                  />
                  <div className="Hint__hint___2XngB">
                    Forget your password?{' '}
                    <Link className="Anchor__a___1_Iz8" onClick={() => super.changeState('forgotPassword')}>
                      Reset password
                    </Link>
                  </div>
                </div>
                <div className="Section__sectionFooter___1T54C">
                  <span className="Section__sectionFooterPrimaryContent___2r9ZX">
                    <button type="button" onClick={() => super.signIn()} className="Button__button___vS7Mv">
                      Sign In
                    </button>
                  </span>
                  <span className="Section__sectionFooterSecondaryContent___Nj41Q">
                    No account?{' '}
                    <Link className="Anchor__a___1_Iz8" onClick={() => super.changeState('signUp')}>
                      Create account
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
      <button
        onClick={async () => {
          const user = await Auth.currentAuthenticatedUser();
          setUser(user);
        }}
      >
        Get User Info
      </button>
      <pre style={{ textAlign: 'left' }}>{JSON.stringify(user?.attributes, null, 2)}</pre>
    </div>
  );
}

export default withAuthenticator(App, false, [
  <MySignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <SignUp />,
  <ConfirmSignUp />,
  <ForgotPassword />,
  <RequireNewPassword />,
]);
