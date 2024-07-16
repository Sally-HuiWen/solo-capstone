import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { thunkDailyLogDetails } from '../../redux/dailyLogs';
import './DailyLogDetails.css';
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from './DeleteDailyLogModal';
import {calculateKidAgeFromBirthToPostDate } from '../utility';

const DailyLogDetails = () => {
    const { dailyLogId } = useParams();
    const dispatch = useDispatch();
    const daily_log = useSelector(state=>state.dailyLogs.dailyLogDetails[dailyLogId])
    console.log('what is your dailyLog by dailyLogId', daily_log)
    const kid = useSelector(state=>state.kids.kidDetails[daily_log?.kid_id])
    console.log('what is your kid', kid)

    useEffect(() => {
        dispatch(thunkDailyLogDetails(dailyLogId));
    }, [dispatch, dailyLogId]);

    return (
        <div className="daily-log-details">
            <div className="details-images">
                {daily_log?.images && daily_log?.images.map((image, index) => (
                    <div key={index} className="image-container">
                        <img id='details-image' src={image.url} alt={`Daily log ${dailyLogId} image ${index + 1}`} />
                    </div>
                ))}
            </div>
            <div className="details-details">
                <h1>{kid?.name}</h1>
                <h3>{kid ? calculateKidAgeFromBirthToPostDate(kid.birth_date, daily_log.created_at) : ''}</h3>
                <h3>{daily_log?.title}</h3>
                <p>{daily_log?.content}</p>          
            
                <div className="update-delete-actions">
                        <Link to={`/dailyLogs/${dailyLogId}/update`}>
                            <button >Update</button>
                        </Link>
                        <OpenModalButton
                            buttonText='Delete' 
                            modalComponent={<DeleteDailyLogModal kidId={kid?.id} dailyLogId={daily_log?.id} />}
                        />
                </div>
            </div>
        </div>
    );
};

export default DailyLogDetails;
