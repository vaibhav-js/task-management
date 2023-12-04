import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/Login.css'
import axios from 'axios'
import swal from 'sweetalert'

function Login() {

  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [nameSignup, setName] = useState('');
  const [usernameSignup, setUsernameSignup] = useState('');
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordSignup, setpasswordSignup] = useState('');
  const [passwordLogin, setpasswordLogin] = useState('');
  const [userRole, setUserRole] = useState('');
  const [disableButton, setDisableButton] = useState(false);
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

  async function handleLogIn(e) {
    e.preventDefault();
    setDisableButton(false)
    const data = {
      "username": usernameLogin.trim(),
      "password": passwordLogin.trim()
    }
    try {
      const response = await axios.post('http://localhost:8080/login', data);
      if (response.data.error === false) {
        await swal("Login Success", "Directing to dashboard..", "success");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        navigate('/dashboard');
      } else {
        await swal("Login Failed", response.data.message, "error");
      }
    
    } catch (error) {
      console.error(error);
    }

    navigate('/dashboard');
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setDisableButton(true);
    const data = {
      "name": nameSignup.trim(),
      "username": usernameSignup.trim(),
      "password": passwordSignup.trim(),
      "userRole": userRole.trim() ? userRole : 'Client'
    }

    try {
      const response = await axios.post('http://localhost:8080/signup', data);
      if (response.data.error === false) {
        await swal(response.data.message, "You will be redirected to Login", "success");
        navigate('/');
        window.location.reload();
      } else {
        await swal("Signup Unsuccessful", response.data.message, "warning");
      }
    } catch (error) {
      console.error(error);
    }
    setDisableButton(false);
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

          <label>
            <input
              type='text'
              placeholder='Name'
              value={nameSignup}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              type='username'
              placeholder='Username'
              value={usernameSignup}
              onChange={(e) => setUsernameSignup(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              type='password'
              placeholder='Password'
              value={passwordSignup}
              onChange={(e) => setpasswordSignup(e.target.value)}
              required
            />
          </label>

          <div>
            <label htmlFor='role'>
              You are a &nbsp;
              <select name='role' id='role' className='custom-dropdown' onChange={(e) => setUserRole(e.target.value)}>
                <option value="Client">Client</option>
                <option value="Provider">Provider</option>
              </select>
            </label>
          </div>
          <button style={{marginTop: "9px"}} disabled={disableButton}>Sign up</button>
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

          <label>
            <input
              type='username'
              placeholder='Username'
              value={usernameLogin}
              onChange={(e) => setUsernameLogin(e.target.value)}
              required
            />
          </label>

          <label>
            <input
              type='password'
              placeholder='Password'
              value={passwordLogin}
              onChange={(e) => setpasswordLogin(e.target.value)}
              required
            />
          </label>

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