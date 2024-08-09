import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { thunkDailyLogDetails } from '../../redux/dailyLogs';
import './DailyLogDetails.css';
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from './DeleteDailyLogModal';
import LikesAndComments from '../LikesAndComments/LikesAndComments'; 

const DailyLogDetails = () => {
    const { dailyLogId } = useParams();
    const dispatch = useDispatch();
    const daily_log = useSelector(state => state.dailyLogs.dailyLogDetails[dailyLogId]);
    const kid = useSelector(state => state.kids.kidDetails[daily_log?.kid_id]);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(thunkDailyLogDetails(dailyLogId));
    }, [dispatch, dailyLogId]);

    return (
        <div className="daily-log-details">
            <div className="details-image">
                <img id='image-image' src={daily_log?.image_url} alt={daily_log?.title} />
            </div>
            <div className="details-details">
                <h1>{kid?.name}</h1>
                <h3>{daily_log?.title}</h3>
                <p id='detail-post-date'>{daily_log?.created_at}</p>
                <p>{daily_log?.content}</p>

                {kid?.user_id === sessionUser?.id && (
                <div className="update-delete-actions">
                    <Link to={`/dailyLogs/${dailyLogId}/update`}>
                        <button className='detail-update-button'>Update</button>
                    </Link>
                    <OpenModalButton
                        className='detail-delete-button'
                        buttonText='Delete'
                        modalComponent={<DeleteDailyLogModal kidId={kid?.id} dailyLogId={daily_log?.id} />}
                    />
                </div>
                )}
                
                <LikesAndComments dailyLogId={dailyLogId} />
            </div>
        </div>
    );
};

export default DailyLogDetails;