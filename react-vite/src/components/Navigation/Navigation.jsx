import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { RiSeedlingFill } from "react-icons/ri";
import "./Navigation.css";

function Navigation() {
  return (
    <div id='header-container'>
      <div >
        <NavLink to="/" id='left-header-box'>
          <RiSeedlingFill id='logo'/>
          <h2 id='website-name'>BundleOfJoy</h2>
        </NavLink>
      </div>

      <div id='right-header-box'>
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
