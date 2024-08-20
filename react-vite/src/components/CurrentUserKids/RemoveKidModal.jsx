import { thunkRemoveKid } from '../../redux/kids';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './RemoveKidModal.css';

export default function RemoveKidModal({ kidId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const ClickYes = async (e) => {
    e.preventDefault();
    try {
      dispatch(thunkRemoveKid(kidId))
      closeModal();
    } catch(error) {
      console.error('Fail to remove kid', error);
    }
  };

  const ClickNo = (e) => {
    e.preventDefault;
    closeModal();
  };

  return (
    <div className="remove-box">
      <h1>Confirm Remove</h1>
      <p className='remove-question'>Are you sure you want to remove this kid from your kids list?</p>
      <button className='yes-button' onClick={(e) => ClickYes(e)}>Yes (Remove Kid)</button>
      <button className='no-button' onClick={(e) => ClickNo(e)}>No (Keep Kid)</button>
    </div>
  );
}
