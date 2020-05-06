import { withStyles } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import { SignIn } from 'aws-amplify-react';
import React from 'react';
import googleButton from '../btn_google_signin_dark.png';

// prettier-ignore
const styles = {
  formContainer: { 
    textAlign: 'center', 
    marginTop: '20px', 
    margin: '5% auto 50px' 
  },
  formSection: {
    position: 'relative',
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '35px 40px',
    textAlign: 'left',
    display: 'inline-block',
    minWidth: '460px',
    borderRadius: '6px',
    boxShadow: '1px 1px 4px 0 rgba(0,0,0,0.15)',
    boxSizing: 'border-box',
  },
  sectionHeader: { 
    color: '#152939', 
    marginBottom: '24px', 
    fontSize: '18px', 
    fontWeight: 500 
  },
  strike: {
    width: '100%',
    textAlign: 'center',
    borderBottom: '1px solid #C4C4C4',
    lineHeight: '0.1em',
    margin: '32px 0',
    color: '#828282',
  },
  strikeContent: { 
    background: 'white', 
    padding: '0 25px', 
    fontSize: '14px', 
    fontWeight: 500 
  },
  sectionBody: { 
    marginBottom: '30px'
  },
  formField: { 
    marginBottom: '22px' 
  },
  inputLabel: { 
    color: '#152939', 
    fontSize: '14px', 
    marginBottom: '8px' 
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    color: '#152939',
    backgroundColor: 'white',
    backgroundImage: 'none',
    border: '1px solid #C4C4C4',
    borderRadius: '3px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  anchor: { 
    color: '#FF9900', 
    cursor: 'pointer', 
    '&hover': { 
      textDecoration: 'underline' 
    } 
  },
  hint: { 
    color: '#828282', 
    fontSize: '12px' 
  },
  sectionFooter: {
    fontSize: '14px',
    color: '#828282',
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  sectionFooterPrimaryContent: { 
    marginLeft: 'auto' 
  },
  sectionFooterSecondaryContent: { 
    marginRight: 'auto', 
    alignSelf: 'center' 
  },
  googleButton: { 
    width: '200px', 
    cursor: 'pointer' 
  },
  button: {
    minWidth: '153px',
    display: 'inline-block',
    marginBottom: 0,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.42857143,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    touchAction: 'manipulation',
    cursor: 'pointer',
    backgroundImage: 'none',
    color: 'white',
    backgroundColor: '#FF9900',
    borderColor: '#ccc',
    textTransform: 'uppercase',
    padding: '14px 0',
    letterSpacing: '1.1px',
    border: 'none',
    '&active': { 
      opacity: 1, 
      backgroundColor: '#E88B01' 
    },
    '&hover': { 
      opacity: 0.8 
    },
  },
};

class CustomSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
  }

  showComponent(theme) {
    const { classes } = this.props;

    return (
      <div className={classes.formContainer}>
        <div className={classes.formSection}>
          <div className={classes.sectionHeader}>
            <span>Sign in to your account</span>
          </div>
          <div>
            <div>
              <img
                src={googleButton}
                alt="Sign In with Google"
                className={classes.googleButton}
                onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
              />
            </div>
            <div className={classes.strike}>
              <span className={classes.strikeContent}>or</span>
            </div>
          </div>
          <form>
            <div className={classes.sectionBody}>
              <div className={classes.formField}>
                <div className={classes.inputLabel}>Email *</div>
                <input
                  onChange={this.handleInputChange}
                  placeholder="Your email address is your username"
                  name="username"
                  type="text"
                  className={classes.input}
                />
              </div>
              <div className={classes.formField}>
                <div className={classes.inputLabel}>Password *</div>
                <input
                  onChange={this.handleInputChange}
                  placeholder="Enter your password"
                  type="password"
                  name="password"
                  className={classes.input}
                />
                <div className={classes.hint}>
                  Forget your password?{' '}
                  <span className={classes.anchor} onClick={() => super.changeState('forgotPassword')}>
                    Reset password
                  </span>
                </div>
              </div>
              <div className={classes.sectionFooter}>
                <span className={classes.sectionFooterPrimaryContent}>
                  <button type="button" onClick={() => super.signIn()} className={classes.button}>
                    Sign In
                  </button>
                </span>
                <span className={classes.sectionFooterSecondaryContent}>
                  No account?{' '}
                  <span className={classes.anchor} onClick={() => super.changeState('signUp')}>
                    Create account
                  </span>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CustomSignIn);
