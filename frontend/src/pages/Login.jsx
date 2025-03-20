import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../utils/useAuth';
import { apiClient } from '../../utils/axios';
import emailValidator from 'email-validator';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {token, setToken, setUser } = useAuthStore();

  
  const handleLogin = async () => {
    setErrorMessage(''); // Reset error message
    setIsLoading(true);
    console.log(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`);
    try {
      const res = await apiClient.post(`/auth/login`, { email, password });
      console.log(res.data);
      setToken(res.data.token);
      navigate("/dashboard");
       // Check role in JWT (if it's an admin)
      // const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT
      // if (decodedToken.role === 'admin') {
      //   navigate('/admin');
      // } else {
      //   navigate('/dashboard');
      // }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Login failed');
    }   
  };
  
    const handleEmailChange = (e) => {
      const newEmail = e.target.value;
      setEmail(newEmail);
      if (!emailValidator.validate(newEmail)) {
        setEmailError('Invalid email format');
        setIsFormValid(false);
      } else {
        setEmailError('');
        setIsFormValid(password);
      }
    };
    {emailError && <div className="text-red-500 mb-2">{emailError}</div>}

    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };

  // const isFormValid = emailValidator.validate(email) && password;
  
  return (
    <div className="p-6 max-w-sm mx-auto mt-10 border rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Login</h2>

      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <p>Email:</p>
      <input
        className="border p-2 w-full mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailChange}
      />
      {emailError && <div className="text-red-500 mb-2">{emailError}</div>}
      <p>Password:</p>
      <input
        className="mt-2 p-2 border w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

<button
  className={`mt-3 p-2 w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''} 
              ${isLoading ? 'bg-indigo-500' : 'bg-blue-500'} text-white`}
  onClick={handleLogin}
  disabled={!isFormValid || isLoading}
>
  {isLoading ? (
    <>
      <svg
       style ={{display: 'inline'}}
        className="mr-3 -ml-1 w-5 h-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Processing…
    </>
  ) : (
    'Log In'
  )}
</button>

      <div className="mt-4">
        Don't have an account? <Link className="text-blue-600 underline" to="/signup">Sign up here</Link>
      </div>
    </div>
  );
}
