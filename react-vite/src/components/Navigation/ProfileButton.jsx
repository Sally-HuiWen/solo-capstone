import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate } from "react-router-dom";
import OpenModalButton from '../OpenModalButton';
import UpdateUserPictureModal from './UpdateUserPictureModal'
import './ProfileButton.css';

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleFriends = () => {
    navigate('/current/friends')
    closeMenu();
  }
  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    navigate('/');
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu} id='profile-account-button'>
       {user?.user_image_url ? (
        <img id="user-profile-image" src={user?.user_image_url} alt="User Profile Image" />
       ) : (
       <FaUserCircle id='user-profile-icon'/>
       )}
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <li>{user.username}</li>
              <li>{user.email}</li>
              {user?.user_image_url ? (
                <li>
                  <OpenModalButton
                    className='profile-buttons'
                    buttonText='Update/Delete profile picture'
                    modalComponent={<UpdateUserPictureModal user={user}/>}
                  />
                </li>
              ): (<li>
                <OpenModalButton
                    className='profile-buttons'
                    buttonText='Add profile picture'
                    modalComponent={<UpdateUserPictureModal user={user}/>}
                  />
              </li>)
              }
              <li>
                <button className='profile-buttons' onClick={handleFriends}>Friends</button>
              </li>
              <li>
                <button id='logout-button' onClick={logout}>Log Out</button>
              </li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
