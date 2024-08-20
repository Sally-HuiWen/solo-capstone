import { thunkDeleteDailyLog} from '../../redux/dailyLogs';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from 'react-router-dom';

export default function DeleteDailyModal({kidId, dailyLogId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const ClickYes = async (e) => {
    e.preventDefault();
    try {
      dispatch(thunkDeleteDailyLog(kidId, dailyLogId))
      closeModal();
      navigate(`kids/${kidId}/dailyLogs`)
    } catch(error) {
      console.error('Fail to delete this daily log', error);
    }
  };

  const ClickNo = (e) => {
    e.preventDefault;
    closeModal();
  };

  return (
    <div className='remove-box'>
      <h1>Confirm Delete</h1>
      <p className='remove-question'>Are you sure you want to delete this moment?</p>
      <button className='yes-button' onClick={(e) => ClickYes(e)}>Yes (Remove Daily Log)</button>
      <button className='no-button' onClick={(e) => ClickNo(e)}>No (Keep Daily Log)</button>
    </div>
  );
}
