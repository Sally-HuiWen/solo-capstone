import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { thunkDailyLogDetails } from '../../redux/dailyLogs';
import './DailyLogDetails.css';
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from './DeleteDailyLogModal';
import { thunkClickLike, thunkRemoveLike, thunkGetLikes } from '../../redux/likes'
import {calculateKidAgeFromBirthToPostDate } from '../utility';
import { AiOutlineLike } from "react-icons/ai";

const DailyLogDetails = () => {
    const { dailyLogId } = useParams();
    const dispatch = useDispatch();
    const daily_log = useSelector(state=>state.dailyLogs.dailyLogDetails[dailyLogId])
    // console.log('what is your dailyLog by dailyLogId', daily_log)
    const kid = useSelector(state=>state.kids.kidDetails[daily_log?.kid_id])
    const sessionUser = useSelector(state=>state.session.user)
    // console.log('what is your kid', kid)
    const likes = useSelector(state => state.likes);
    console.log('what are likes', likes)
    console.log('what is likes.length', Object.values(likes))

    useEffect(() => {
        dispatch(thunkDailyLogDetails(dailyLogId));
    }, [dispatch, dailyLogId]);

    useEffect(() => {
        if (daily_log) {
            dispatch(thunkGetLikes(daily_log.id));
        }
      }, [dispatch, daily_log]);

    const clickToLike = (dailyLogId) => {
    dispatch(thunkClickLike(dailyLogId));
    };

    const clickToUnlike = (dailyLogId) => {
        dispatch(thunkRemoveLike(dailyLogId));
      };

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
                            <button >Update</button>
                        </Link>
                        <OpenModalButton
                            buttonText='Delete' 
                            modalComponent={<DeleteDailyLogModal kidId={kid?.id} dailyLogId={daily_log?.id} />}
                        />
                </div>
                )}
            </div>

            <div className='likes-div'>
                  <div id='likes-count-div'>
                    <AiOutlineLike />{Object.values(likes)?.length}
                    <p>{Object.values(likes)}</p>
                  </div>
                {Object.values(likes)? (
                  <button onClick={() => clickToLike(daily_log?.id)}> <AiOutlineLike />Like</button>
                ) : (
                  <button onClick={() => clickToUnlike(daily_log?.id)}> <AiOutlineLike />Unlike</button>
                )}
              </div>


        </div>
    );
};

export default DailyLogDetails;
