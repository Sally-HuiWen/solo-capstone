import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { RiSeedlingFill } from "react-icons/ri";
import "./Navigation.css";
import { useSelector } from "react-redux";

function Navigation() {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const handleClick = () => {
    if (sessionUser) {
      navigate('/my-kids-list')
    } else {
      navigate('/')
    }

  }
  return (
    <div id='header-container'>
      <div onClick={handleClick} id='left-header-box'>
          <RiSeedlingFill id='logo'/>
          <button id='website-name'><h2>BundleOfJoy</h2></button>
      </div>

      <div id='right-header-box'>
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
