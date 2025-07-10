import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Login.css';
import HomeNavbar from './HomeNavbar';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setErrorMessage('Please verify your email before logging in.');
        return;
      }

      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        if (!docSnap.data().hasLoggedIn) {
          navigate('/welcome');
        } else {
          navigate('/home');
        }
      } else {
        console.error("No such user document!");
      }
    } catch (error) {
      setErrorMessage('Invalid email or password.');
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

        const userDoc = doc(db, "users", userCredential.user.uid);
        await setDoc(userDoc, {
            email: userCredential.user.email,
            hasLoggedIn: false,
            role: "Member"
        });

        setErrorMessage('Verification email sent! Please check your inbox');
        setIsCreatingAccount(false);
    } catch (error) {
        console.error("Error creating account: ");
        if (error.code === 'auth/email-already-in-use') {
            setErrorMessage('This email is already in use.');
        } else if (error.code === 'auth/weak-password') {
            setErrorMessage('The password is too weak.');
        } else {
            setErrorMessage('Failed to create an account: ');
        }
    }
};

  const handlePasswordReset = async () => {
    if (!username) {
      setErrorMessage('Please enter your email to reset your password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, username);
      setErrorMessage('Password reset email sent! Please check your inbox.');
      setIsResettingPassword(false);
    } catch (error) {
      setErrorMessage('Error sending password reset email: ');
    }
  };

  const handleToggle = () => {
    setIsCreatingAccount(false);
    setIsResettingPassword(false);
  };

  return (
    <div>
      <HomeNavbar />
      <div className="login-container">
        <h1>{isCreatingAccount ? 'Create Account' : isResettingPassword ? 'Reset Password' : 'Sign In'}</h1>
        <form onSubmit={isCreatingAccount ? handleSignupSubmit : isResettingPassword ? handlePasswordReset : handleLoginSubmit}>
          <div>
            <label>Purdue Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {!isResettingPassword && (
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isCreatingAccount}
              />
            </div>
          )}
          <button type="submit">{isCreatingAccount ? 'Create Account' : isResettingPassword ? 'Send Reset Email' : 'Login'}</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <p>
          {isCreatingAccount ? (
            <span className="toggle-link" onClick={handleToggle}>Already have an account? Login</span>
          ) : isResettingPassword ? (
            <span className="toggle-link" onClick={handleToggle}>Back to Login</span>
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