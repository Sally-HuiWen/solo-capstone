import { useEffect, useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

function LoginFormModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { closeModal } = useModal();

  useEffect(()=> {
    const errorObj = {};
        if (!email) errorObj.email='Email is required.';
        if (!email.includes('@')) errorObj.emailInclude = 'Please provide a valid email.';
        if (!password) errorObj.password = 'Password is required.';
        if (password.length < 6 || password.length > 20) errorObj.passwordLength = "Password must be between 6 and 20 characters."
        setErrors(errorObj);
    }, [email, password]);

  const demoLogIn = () => {
    setEmail('demo@aa.io');
    setPassword('password');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (Object.values(errors).length > 0) return;

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
      navigate('/your-kids-list')
    }
  };

  return (
    <div className="login-modal-container">
      <h2>Log In</h2>
      <form className="login-form" onSubmit={handleSubmit}>

        <div>
          <label htmlFor="log-in-email">Email</label>
          {hasSubmitted&& errors.email && (<span className="error-message">{errors.email}</span>)}
          {hasSubmitted&& errors.emailInclude && (<span className="error-message">{errors.emailInclude}</span>)}
          <input
              id='log-in-email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
        
            />
        </div>

        <div>
          <label htmlFor="log-in-password">Password</label>
          {hasSubmitted&& errors.password && (<span className="error-message">{errors.password}</span>)}
          {hasSubmitted&& errors.passwordLength && (<span className="error-message">{errors.passwordLength}</span>)}
          <input
              id='log-in-password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

            />
        </div>

        <button type="submit">Log In</button>
        <button id='demo-user-button' onClick={demoLogIn}>
        Demo User
        </button>
      </form>
      
    </div>
  );
}

export default LoginFormModal;
