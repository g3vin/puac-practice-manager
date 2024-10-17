import React, { useState } from 'react';
import { auth } from './firebase'; // Import Firebase auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false); // New state variable
  const navigate = useNavigate(); // Get navigate function from useNavigate

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      onLogin(); // Call the onLogin function to update the authentication state
      navigate('/home'); // Navigate to home after successful login
    } catch (error) {
      setErrorMessage('Invalid login credentials');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!username.endsWith('@purdue.edu')) {
        setErrorMessage('Email must end with @purdue.edu');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      await sendEmailVerification(userCredential.user);
      setErrorMessage('Verification email sent! Please Check your inbox.');
      setIsCreatingAccount(false);
    } catch (error) {
      setErrorMessage('Failed to create an account');
    }
  };
  //email, first_name, last_name, purchased_practices, practice_log

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, username);
      setErrorMessage('Password reset email sent. Please check your inbox.');
      setIsResettingPassword(false);
    } catch (error) {
      setErrorMessage('Failed to send password reset email');
    }
  };

  return (
    <div>
      <h2>Purdue University Archery Club</h2>
      <div className="login-container">
        <h1>{isCreatingAccount ? 'Create Account' : isResettingPassword ? 'Reset Password' : 'Sign In'}</h1>
        <form onSubmit={isCreatingAccount ? handleSignupSubmit : isResettingPassword ? handleResetPassword : handleLoginSubmit}>
          <div>
            <label>Purdue Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {/* Only show the password label and input when not resetting password */}
          {!isResettingPassword && (
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit">{isCreatingAccount ? 'Create Account' : isResettingPassword ? 'Reset Password' : 'Login'}</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <p>
            {isCreatingAccount ? (
                <>
                <span className="toggle-link" onClick={() => setIsCreatingAccount(false)}>Already have an account? Login</span>
                <br />
                </>
            ) : isResettingPassword ? (
                <span className="toggle-link" onClick={() => setIsResettingPassword(false)}>Back to Login</span>
            ) : (
                <>
                <span className="toggle-link" onClick={() => setIsCreatingAccount(true)}>Create an Account</span>
                <br />
                <span className="toggle-link" onClick={() => setIsResettingPassword(true)}>Forgot Password?</span>
                </>
            )}
        </p>
      </div>
    </div>
  );
}

export default Login;