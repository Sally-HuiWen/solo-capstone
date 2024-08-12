import { thunkDeleteComment } from '../../redux/comments';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './DeleteCommentModal.css';

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
    <div className="delete-comment-div">
      <h2>Confirm Delete Comment</h2>
      <h4>Are you sure you want to delete this comment?</h4>
      <button className='yes-button' onClick={(e) => ClickYes(e)}>Yes (Delete Comment)</button>
      <button className='no-button' onClick={(e) => ClickNo(e)}>No (Keep Comment)</button>
    </div>
  );
}
