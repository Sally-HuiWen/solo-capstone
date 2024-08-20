import { thunkDeleteComment } from '../../redux/comments';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

export default function DeleteCommentModal({ commentId, dailyLogId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const ClickYes = async (e) => {
    e.preventDefault();
    try {
      dispatch(thunkDeleteComment(commentId, dailyLogId))
      closeModal();
    } catch(error) {
      console.error('fail to delete comment', error);
    }
  };

  const ClickNo = (e) => {
    e.preventDefault;
    closeModal();
  };

  return (
    <div className="remove-box">
      <h1 className='remove-box-title'>Confirm Delete Comment</h1>
      <p className='remove-question'>Are you sure you want to delete this comment?</p>
      <button className='yes-button' onClick={(e) => ClickYes(e)}>Yes (Delete Comment)</button>
      <button className='no-button' onClick={(e) => ClickNo(e)}>No (Keep Comment)</button>
    </div>
  );
}
