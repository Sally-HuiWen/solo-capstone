import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { thunkDailyLogDetails } from '../../redux/dailyLogs';
import './DailyLogDetails.css';
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from './DeleteDailyLogModal';
import { thunkClickLike, thunkRemoveLike, thunkGetLikes } from '../../redux/likes';
import { calculateKidAgeFromBirthToPostDate } from '../utility';
import { BiMessageRounded } from "react-icons/bi";
import { IoMdThumbsUp } from "react-icons/io";

const DailyLogDetails = () => {
    const { dailyLogId } = useParams();
    const dispatch = useDispatch();
    const daily_log = useSelector(state => state.dailyLogs.dailyLogDetails[dailyLogId]);
    const kid = useSelector(state => state.kids.kidDetails[daily_log?.kid_id]);
    const sessionUser = useSelector(state => state.session.user);
    const likes = useSelector(state => state.likes[dailyLogId] || []);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showLikesList, setShowLikesList] = useState(false);

    useEffect(() => {
        dispatch(thunkDailyLogDetails(dailyLogId));
    }, [dispatch, dailyLogId]);

    useEffect(() => {
        if (daily_log) {
            dispatch(thunkGetLikes(daily_log.id));
        }
    }, [dispatch, daily_log]);

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
    
    const handleCommentClick = ()=> {
        alert('This feature coming soon!')
    }
    return (
        <div className="daily-log-details">
            <div className="details-image">
                <img id='image-image' src={daily_log?.image_url} alt={daily_log?.title} />
            </div>
            <div className="details-details">
                <h1>{kid?.name}</h1>
                <h3>{kid ? calculateKidAgeFromBirthToPostDate(kid.birth_date, daily_log.created_at) : ''}</h3>
                <h3>{daily_log?.title}</h3>
                <p>{daily_log?.content}</p>

                {kid?.user_id === sessionUser?.id && (
                    <div className="update-delete-actions">
                        <Link to={`/dailyLogs/${dailyLogId}/update`}>
                            <button>Update</button>
                        </Link>
                        <OpenModalButton
                            buttonText='Delete'
                            modalComponent={<DeleteDailyLogModal kidId={kid?.id} dailyLogId={daily_log?.id} />}
                        />
                    </div>
                )}
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
                    {userLiked ? (
                        <button 
                            onClick={clickToUnlike} 
                            disabled={isProcessing} 
                            className={`like-button ${userLiked ? 'liked' : ''}`}
                        >
                            <div className='div-like'>
                              <div><IoMdThumbsUp className='icon-two'/></div>
                              <div className='like-like'>Like</div>
                            </div>
                        </button>
                    ) : (
                        <button 
                            onClick={clickToLike} 
                            disabled={isProcessing} 
                            className={`like-button ${userLiked ? 'liked' : ''}`}
                        >
                            <div className='div-like'>
                              <div><IoMdThumbsUp className='icon-two'/></div>
                              <div className='like-like'>Like</div>
                            </div>
                        </button>
                    )}
                        <button id='comment-button' onClick={handleCommentClick}>
                            <div><BiMessageRounded/></div>
                            <div>Comment</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyLogDetails;