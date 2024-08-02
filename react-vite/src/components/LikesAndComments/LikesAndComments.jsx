import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkClickLike, thunkRemoveLike, thunkGetLikes } from '../../redux/likes';
import { BiMessageRounded } from "react-icons/bi";
import { IoMdThumbsUp } from "react-icons/io";
import './LikesAndComments.css';

const LikesAndComments = ({ dailyLogId }) => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const likes = useSelector(state => state.likes[dailyLogId] || []);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);

    useEffect(() => {
        if (dailyLogId) {
            dispatch(thunkGetLikes(dailyLogId));
        }
    }, [dispatch, dailyLogId]);

    const clickToLike = async () => {
        setIsProcessing(true);
        const res = await dispatch(thunkClickLike(dailyLogId));
        if (res) {
            // Update state directly after liking instead of dispatch(thunkGetLikes(dailyLogId));
            dispatch({ type: 'likes/addLike', like: res });
        }
        setIsProcessing(false);
    };

    const clickToUnlike = async () => {
        setIsProcessing(true);
        const res = await dispatch(thunkRemoveLike(dailyLogId));
        if (res) {
            // Update state directly after unliking
            dispatch({ type: 'likes/removeLike', dailyLogId, likeId: res.id });
        }
        setIsProcessing(false);
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
        alert('This feature coming soon!');
    };

    return (
        <div className='likes-div'>
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
        </div>
    );
};

export default LikesAndComments;