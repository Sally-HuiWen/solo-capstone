import { thunkDeleteProfileImage } from '../../redux/session';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from 'react-router-dom';

export default function DeleteUserImageModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const ClickYes = async (e) => {
    e.preventDefault();
    try {
      dispatch(thunkDeleteProfileImage())
      closeModal();
      navigate('/your-kids-list')
    } catch(error) {
      console.error('fail to delete user image', error);
    }
  };

  const ClickNo = (e) => {
    e.preventDefault;
    closeModal();
    navigate('/your-kids-list')
  };

  return (
    <div className="remove-box">
      <h1>Confirm Delete Profile Image</h1>
      <p className='remove-question'>Are you sure you want to delete your profile image?</p>
      <button className='yes-button' onClick={(e) => ClickYes(e)}>Yes (Delete Image)</button>
      <button className='no-button' onClick={(e) => ClickNo(e)}>No (Keep Image)</button>
    </div>
  );
}
