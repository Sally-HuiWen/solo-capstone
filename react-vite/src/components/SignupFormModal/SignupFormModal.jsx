import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
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
    if (!first_name) newErrors.firstName = 'First name is required'
    if (first_name.length < 3 || first_name.length > 30) newErrors.firstNameLength = "First name must be between 3 and 30 characters"
    if (!last_name) newErrors.lastName = 'Last name is required'
    if (last_name.length < 3 || last_name.length > 30) newErrors.lastNameLength = "Last name must be between 3 and 30 characters"
    if (!username) newErrors.username = 'username is required'
    if (username.length < 3 || username.length > 30) newErrors.usernameLength = "Username must be between 3 and 30 characters"
    if (!email) newErrors.email = 'email is required'
    if (!email.includes('@')) newErrors.emailInclude = "Please provide a valid email"
    if (!password) newErrors.password = 'password is required'
    if (password.length < 6 || password.length > 20) newErrors.passwordLength = "Password must be between 6 and 20 characters."
    if (!confirmPassword) newErrors.confirmPassword = 'confirmPassword is required'
    if (password !== confirmPassword) newErrors.match =  "Confirm Password field must be the same as the Password field"
    setErrors(newErrors)
}, [first_name, last_name, username, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

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
    }
  };

  return (
    <>
      <div className="signup-modal-container">
        <h2>Create your account</h2>
        <p>Registration is easy.</p>
        {errors.server && <p className="error-message">{errors.server}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {hasSubmitted && errors.email && <p className="error-message">{errors.email}</p>}
          {hasSubmitted && errors.emailInclude && <p className="error-message">{errors.emailInclude}</p>}
          <label>
            First Name
            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {hasSubmitted && errors.firstName && <p className="error-message">{errors.firstName}</p>}
          {hasSubmitted && errors.firstNameLength && <p className="error-message">{errors.firstNameLength}</p>}
          <label>
            Last Name
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {hasSubmitted && errors.lastName && <p className="error-message">{errors.lastName}</p>}
          {hasSubmitted && errors.lastNameLength && <p className="error-message">{errors.lastNameLength}</p>}
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {hasSubmitted && errors.username && <p className="error-message">{errors.username}</p>}
          {hasSubmitted && errors.usernameLength && <p className="error-message">{errors.usernameLength}</p>}
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {hasSubmitted && errors.password && <p className="error-message">{errors.password}</p>}
          {hasSubmitted && errors.passwordLength && <p className="error-message">{errors.passwordLength}</p>}
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {hasSubmitted && errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          {hasSubmitted && errors.match && <p className="error-message">{errors.match}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}

export default SignupFormModal;
