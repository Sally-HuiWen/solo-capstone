import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";
import { useNavigate } from "react-router-dom";


function SignupFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { closeModal } = useModal();

  useEffect (() => {
    const newErrors = {};
    if (!first_name) newErrors.firstName = 'First name is required.'
    if (first_name && first_name.length < 3 || first_name.length > 30) newErrors.firstNameLength = "First name must be between 3 and 30 characters."
    if (!last_name) newErrors.lastName = 'Last name is required.'
    if (last_name && last_name.length < 3 || last_name.length > 30) newErrors.lastNameLength = "Last name must be between 3 and 30 characters."
    if (!username) newErrors.username = 'The username is required.'
    if (username && username.length < 3 || username.length > 30) newErrors.usernameLength = "Username must be between 3 and 30 characters."
    if (!email) newErrors.email = 'The email is required.'
    if (email && !email.includes('@')) newErrors.emailInclude = "Please provide a valid email."
    if (!password) newErrors.password = 'The password is required.'
    if (password && password.length < 6 || password.length > 20) newErrors.passwordLength = "Password must be between 6 and 20 characters."
    if (!confirmPassword) newErrors.confirmPassword = 'The confirmPassword is required.'
    if (confirmPassword && password !== confirmPassword) newErrors.match =  "Confirm Password field match the Password."
    setErrors(newErrors)
}, [first_name, last_name, username,email, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (Object.values(errors).length > 0) return;

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        first_name,
        last_name,
        username,
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
      <div className="signup-modal-container">
        <h2 className='signup-form-title'> Create your account</h2>
        <p className='registration-is-easy'>Registration is easy.</p>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div id='signup-email-box1'>
            <label htmlFor="signup-email" className='signup-labels'>Email</label>
            {hasSubmitted && errors.email && (<span className="signup-error-message">{errors.email}</span>)}
            {hasSubmitted && errors.emailInclude && (<span className="signup-error-message">{errors.emailInclude}</span>)}
            <input
              id='signup-email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div id='signup-username-box2'>
            <label htmlFor="signup-username" className='signup-labels'>Username</label>
            {hasSubmitted && errors.username && (<span className="signup-error-message">{errors.username}</span>)}
            {hasSubmitted && errors.usernameLength && (<span className="signup-error-message">{errors.usernameLength}</span>)}
            <input
              id='signup-username'
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div id='signup-first-name-box3'>
            <label htmlFor="signup-first-name" className='signup-labels'>First Name</label>
            {hasSubmitted && errors.firstName && (<span className="signup-error-message">{errors.firstName}</span>)}
            {hasSubmitted && errors.firstNameLength && (<span className="signup-error-message">{errors.firstNameLength}</span>)}
            <input
                id='signup-first-name'
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
              />
          </div>

          <div id='signup-last-name-box4'>
            <label htmlFor="signup-last-name" className='signup-labels'>Last Name</label>
              {hasSubmitted && errors.lastName && (<span className="signup-error-message">{errors.lastName}</span>)}
              {hasSubmitted && errors.lastNameLength && (<span className="signup-error-message">{errors.lastNameLength}</span>)}
            <input
                id='signup-last-name'
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
              />
          </div>

          <div id='signup-password-box5'>
            <label htmlFor="signup-password" className='signup-labels'>Password</label>
            {hasSubmitted && errors.password && (<span className="signup-error-message">{errors.password}</span>)}
            {hasSubmitted && errors.passwordLength &&(<span className="signup-error-message">{errors.passwordLength}</span>)}
            <input
                id='signup-password'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
          </div>

          <div id='signup-confirm-password-box6'>
            <label htmlFor="signup-confirm-password" className='signup-labels'>Confirm Password</label>
            {hasSubmitted && errors.confirmPassword && (<span className="signup-error-message">{errors.confirmPassword}</span>)}
            {hasSubmitted && errors.match && (<span className="signup-error-message">{errors.match}</span>)}
            <input
                id='signup-confirm-password'
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
          </div>
        
          <button className='signup-form-submit-button' type="submit">Register</button>
        </form>
      </div>
  );
}

export default SignupFormModal;
