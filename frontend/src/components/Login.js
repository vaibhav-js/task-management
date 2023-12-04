import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/Login.css'

function Login() {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const navigate = useNavigate();

  function handlePanel() {
    setRightPanelActive(!isRightPanelActive);
  }
  function handleGoogleLogInSuccess() {
    alert('pass');
  }
  function handleGoogleLogInError() {
    alert('error');
  }
  function handleLogIn() {
    alert('Login successful');
    navigate('/dashboard');
  }
  function handleSignUp() {
    alert('signup succesful');
  }
  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id='container'>
      <div className='form-container sign-up-container'>
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="/google" target="_blank" className="social">
              <GoogleLoginButton onSuccess={handleGoogleLogInSuccess} onError={handleGoogleLogInError}/>
            </a>
          </div>
          <span>Or use your Email for registration</span>
          <label><input type='text' placeholder='Name' required></input></label>
          <label><input type='username' placeholder='Username' required /></label>
          <label><input type='password' placeholder='Password' required /></label>
          <div>
            <label for='role'>
              You are a &nbsp;
              <select name='role' id='role' className='custom-dropdown'>
                <option value="Client">Client</option>
                <option value="Provider">Provider</option>
              </select>
            </label>
          </div>
          <button style={{marginTop: "9px"}}>Sign up</button>
        </form>
      </div>

      <div className='form-container sign-in-container'>
        <form onSubmit={handleLogIn}>
          <h1>Login</h1>
          <div className="social-container">
            <a href="/google" target="_blank" className="social">
              <GoogleLoginButton onSuccess={handleGoogleLogInSuccess} onError={handleGoogleLogInError}/>
            </a>
          </div>
          <span>Or sign in using your username</span>
          <label><input type='username' placeholder='Username' required /></label>
          <label><input type='password' placeholder='Password' required /></label>
          <button>Log in</button>
          <a href='/forgot'>Forgot your password ?</a>
        </form>
      </div>

      <div className='overlay-container'>
        <div className='overlay'>
          <div className='overlay-panel overlay-left'>
            <h1>Login</h1>
            <p>Login here if you already have an account</p>
            <button className='ghost mt-5' id='signIn' onClick={handlePanel}>Log In</button>
          </div>

          <div className='overlay-panel overlay-right'>
            <h1>Create account</h1>
            <p>Signup here if you do not have an account</p>
            <button className='ghost' id='signUp' onClick={handlePanel}>Sign Up</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login