import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkClickLike, thunkRemoveLike, thunkGetLikes } from '../../redux/likes';
import { thunkGetComments,thunkLeaveComment, thunkUpdateComment} from '../../redux/comments';
import { BiMessageRounded } from "react-icons/bi";
import { IoMdThumbsUp } from "react-icons/io";
import { FaUserCircle } from 'react-icons/fa';
import { BsFillSendFill } from "react-icons/bs";
import OpenModalButton from '../OpenModalButton';
import DeleteCommentModal from './DeleteCommentModal';
import './LikesAndComments.css';

const LikesAndComments = ({ dailyLogId }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const likes = useSelector(state => state.likes[dailyLogId] || []);
    const comments = useSelector(state => state.comments[dailyLogId] || []);
    // console.log('what is comments', comments)
    const [isProcessing, setIsProcessing] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [updatedComment, setUpdatedComment] = useState('');
    

    useEffect(() => {
        if (dailyLogId) {
            dispatch(thunkGetLikes(dailyLogId));
            dispatch(thunkGetComments(dailyLogId));
        }
    }, [dispatch, dailyLogId]);

    const clickToLike = () => {
        setIsProcessing(true);
        dispatch(thunkClickLike(dailyLogId)).then(() => {
            dispatch(thunkGetLikes(dailyLogId));
            setIsProcessing(false);
        });
    };

    const clickToUnlike = () => {
        setIsProcessing(true);
        dispatch(thunkRemoveLike(dailyLogId)).then(() => {
            dispatch(thunkGetLikes(dailyLogId));
            setIsProcessing(false);
        });
    };
            
    const userLiked = likes.some(like => like.user_id === sessionUser?.id);

    const handleLike = () => {
        if (userLiked) {
            clickToUnlike();
        } else {
            clickToLike();
        }
    };

    const handleCommentClick = () => {
        setShowComments(prev => !prev); // goggle the comments section visibility
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const result = await dispatch(thunkLeaveComment(dailyLogId, newComment));
            if (result && result.comment) {
                // console.log('Dispatched LEAVE_COMMENT action:', result.comment);
                setNewComment('');// clear the input field
            } else {
                console.error('Failed to submit comment:', result.error);
            }
        }
    };

    const handleEditClick = (comment) => {
        setEditingComment(comment.id);
        setUpdatedComment(comment.comment);
    };

    const handleUpdateSubmit = async (commentId) => {
        if (updatedComment.trim()) {
            const result = await dispatch(thunkUpdateComment(commentId, updatedComment));
            // console.log('what is the result in updatedSubmit', result);
            
            if (result && result.comment) {
                console.log('Dispatched UPDATE_COMMENT action:', result.comment);
                setEditingComment(null);
                setUpdatedComment('');
            } else {
                console.error('Failed to update comment:', result);
            }
        }
    };

    return (
        <div className='likes-div'>
            <div id='count-like-comment'>
                <div 
                    id='likes-count-div' 
                    onMouseEnter={() => setShowLikesList(true)}
                    onMouseLeave={() => setShowLikesList(false)}
                >
                    <div id='icon-and-count'>
                        <div><IoMdThumbsUp className='icon'/></div>
                        <div id='count-num'>{likes.length}</div>
                    </div>
                    <ul className={`likes-list ${showLikesList ? 'show' : ''}`}>
                        {likes.map((like, index) => (
                            <li key={index}>{like.username}</li>
                        ))}
                    </ul>
                </div>
                <div className='count-comment-div'>
                    <p id='comment-num'>{comments?.length? comments?.length:0}</p>
                    <p id='comments'>comments</p>
                </div>
            </div>

            <div id='like-and-comment-div'>
                <button 
                    onClick={handleLike} 
                    disabled={isProcessing} 
                    className={`like-button ${userLiked ? 'liked' : ''}`}
                >
                    <div className='div-like'>
                      <div><IoMdThumbsUp className='icon-two'/></div>
                      <div className='like-like'>Like</div>
                    </div>
                </button>
        
                <button id='comment-button' onClick={handleCommentClick}>
                    <div><BiMessageRounded/></div>
                    <div>Comment</div>
                </button>
            </div>

            {showComments && (
                <div id='comments-section'>
                    <ul className='comments-list'>
                        {comments?.map((comment, index) => (
                            <li key={index} className='each-comment'>
                                {comment?.user?.user_image_url ? (
                                    <img className="comment-user-image" src={comment?.user?.user_image_url} alt="User Profile Image" />
                                ) : (
                                    <FaUserCircle className='comment-user-icon'/>
                                )}
                                <div className='comment-user-info-content'>
                                    <p className='comment-user-name'>{comment?.user?.first_name} {comment?.user?.last_name}</p>
                                    {editingComment === comment.id ? (
                                        <div >
                                            <textarea
                                                className='edited-comment-textarea'
                                                value={updatedComment}
                                                onChange={(e) => setUpdatedComment(e.target.value)}
                                            />
                                            <div id='update-cancel-comment-buttons'>
                                                <button className='edit-comment-update-button' onClick={() => handleUpdateSubmit(comment?.id)}>Update</button>
                                                <button className ='edit-comment-cancel-button' onClick={() => setEditingComment(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className='comment-user-content'>{comment.comment}</p>
                                            {sessionUser?.id === comment.user_id && (
                                                <div className='comment-actions-buttons'>
                                                    <button className='edit-comment-button' onClick={() => handleEditClick(comment)}>Edit</button>
                                                    <OpenModalButton
                                                        className='delete-action'
                                                        buttonText='Delete'
                                                        modalComponent={<DeleteCommentModal commentId={comment?.id} dailyLogId={comment?.daily_log_id} />}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div id='leave-comment-div'>
                        {sessionUser?.user_image_url ? (
                            <img className="comment-user-image" src={sessionUser?.user_image_url} alt="User Profile Image" />
                        ) : (
                            <FaUserCircle className='comment-user-icon'/>
                        )}
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write a comment...'
                        />
                        <button id='send-comment-button' onClick={handleCommentSubmit}><BsFillSendFill /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikesAndComments;