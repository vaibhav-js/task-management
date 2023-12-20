import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import '../styles/Login.css'
import axios from 'axios'
import swal from 'sweetalert'
const url = process.env.REACT_APP_SERVICE_URL

function Login() {

  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [nameSignup, setName] = useState('');
  const [usernameSignup, setUsernameSignup] = useState('');
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordSignup, setpasswordSignup] = useState('');
  const [passwordLogin, setpasswordLogin] = useState('');
  const [userRole, setUserRole] = useState('Client');
  const [disableButton, setDisableButton] = useState(false);
  const navigate = useNavigate();

  function handlePanel() {
    setRightPanelActive(!isRightPanelActive);
  }

  async function handleGoogleLogInSuccess(googleResponse) {
    try {
      const data = {
        token: googleResponse.credential,
        client_id: googleResponse.client_id
      }
      const response = await axios.post(`${url}/users/googlelogin`, data);
      if (response.data.emailVerified === true) {
        const userData = {
          "username": response.data.username,
          "password": response.data.username
        }
        try {
          const loginResponse = await axios.post(`${url}/users/login`, userData);
          if (loginResponse.data.error === false) {
            await swal("Login Successful", "You will be redirected to Login", "success");
            localStorage.setItem('name', loginResponse.data.name);
            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('role', loginResponse.data.role);
            navigate('/dashboard');
          } else {
            await swal("Login Failed", "Invalid Credentials", "error");
          }
        } catch(error) {
          console.error(error);
        }
      } else {
        await swal("Login Error", "Verify your google email", "warning");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleGoogleLogInError() {
    alert('error');
  }

  async function handleGoogleSignUpSuccess(googleResponse) {
    try {
      const data = {
        token: googleResponse.credential,
        client_id: googleResponse.client_id
      }
      const response = await axios.post(`${url}/users/googlelogin`, data);
      if (response.data.emailVerified === true) {
        const userData = {
          "name": response.data.name,
          "username": response.data.username,
          "password": response.data.username,
          "userRole": userRole.trim()
        }
        try {
          const signupResponse = await axios.post(`${url}/users/signup`, userData);
          if (signupResponse.data.error === false) {
            await swal("Signup Successful", "You will be redirected to Login", "success");
            window.location.reload();
          } else {
            await swal("Signup Failed", signupResponse.data.message, "error");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        await swal("Signup Error", "Verify your google email", "warning");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogIn(e) {
    e.preventDefault();
    setDisableButton(false)
    const data = {
      "username": usernameLogin.trim().toLowerCase(),
      "password": passwordLogin.trim()
    }
    try {
      const response = await axios.post(`${url}/users/login`, data);
      if (response.data.error === false) {
        await swal("Login Success", "Directing to dashboard..", "success");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('role', response.data.role);
        navigate('/dashboard');
      } else {
        await swal("Login Failed", response.data.message, "error");
      }
    
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setDisableButton(true);
    const data = {
      "name": nameSignup.trim(),
      "username": usernameSignup.trim().toLowerCase(),
      "password": passwordSignup.trim(),
      "userRole": userRole.trim()
    }

    try {
      const response = await axios.post(`${url}/users/signup`, data);
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
    <div className='login__signup__container'>
      <div className={`login__container ${isRightPanelActive ? 'right__panel__active' : ''}`} id='container'>
      <div className='form__container signup__container'>
        <form onSubmit={handleSignUp}>


          <h1>Create Account</h1>
          <br />

          <div>
            <label htmlFor='role'>
              Please change if you are a provider
              <select name='role' id='role' className='custom__dropdown' onChange={(e) => setUserRole(e.target.value)}>
                <option value="Client">Client</option>
                <option value="Provider">Provider</option>
              </select>
            </label>
          </div>

          <div className="social__container">
            <GoogleLoginButton onSuccess={handleGoogleSignUpSuccess} onError={handleGoogleLogInError} />
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
          <button className='login__signup__button' style={{marginTop: "9px"}} disabled={disableButton}>Sign up</button>
        </form>
      </div>

      <div className='form__container signin__container'>
        <form onSubmit={handleLogIn}>
          <h1>Login</h1>

          <div className="social__container">
            <GoogleLoginButton onSuccess={handleGoogleLogInSuccess} onError={handleGoogleLogInError}/>
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

          <button className='login__signup__button' >Log in</button>
          <a href='/forgot'>Forgot your password ?</a>


        </form>
      </div>

      <div className='login__signup__overlay__container'>
        <div className='parent__overlay'>
          <div className='overlay__panel overlay__left'>
            <h1>Login</h1>
            <p>Login here if you already have an account</p>
            <button className='login__signup__button ghost mt-5' id='signIn' onClick={handlePanel}>Log In</button>
          </div>

          <div className='overlay__panel overlay__right'>
            <h1>Create account</h1>
            <p>Signup here if you do not have an account</p>
            <button className='login__signup__button ghost' id='signUp' onClick={handlePanel}>Sign Up</button>
          </div>
        </div>
      </div>

    </div>
    </div>
  )
}

export default Login