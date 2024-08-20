import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { thunkGetKidDetails } from '../../redux/kids';
import { thunkGetAllDailyLogs } from '../../redux/dailyLogs';
import { PiBabyLight } from "react-icons/pi";
import { calculateKidAgeFromBirthToNow } from '../utility';
import './KidDailyLogs.css';
import LikesAndComments from '../LikesAndComments/LikesAndComments'; 
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from '../DailyLogDetails/DeleteDailyLogModal';

const KidDailyLogs = () => {
  const { kidId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const kid = useSelector(state => state.kids.kidDetails[kidId]);
  const allDailyLogsForThisKid = useSelector(state => state.dailyLogs.allDailyLogs[kidId] || []);

  useEffect(() => {
    if (kidId) {
      dispatch(thunkGetKidDetails(kidId));
      dispatch(thunkGetAllDailyLogs(kidId));
    }
  }, [dispatch, kidId]);

  const handleCreateAddDailyLog = () => {
    navigate(`/kids/${kidId}/DailyLogs/new`);
  };

  return (
    <div id="daily-logs-container">
      <div className="daily-logs-header">
        <div id='kid-image-name-age-div'>
          {kid?.kid_image_url ? (
            <img 
              className='kid-profile-img' 
              src={kid.kid_image_url} 
              alt={`${kid?.name}'s profile`} 
            />
          ) : (
            <PiBabyLight className='kidDailyLogs-profile-icon' />
          )}
          <div id='kid-name-age'>
            <h2 className='kidDailyLogs-kid-name'>{kid?.name}</h2>
            <p className='kidDailyLogs-kid-age'>
              {calculateKidAgeFromBirthToNow(kid?.birth_date)}
            </p> 
          </div>
        </div>

        {kid?.user_id === sessionUser?.id && (
          <button id="add-dailyLog-button" onClick={handleCreateAddDailyLog}>
            Add Sweet Moment
          </button>
        )}
      </div>
    
      <div className="daily-logs-content">
        <h2 className='kid-moments'>{kid?.name}&apos;s Moments</h2>
        {allDailyLogsForThisKid.length === 0 ? (
          <p className='kid-moments'>No Moments found</p>
        ) : (
          <div id='logs-div'>
            {allDailyLogsForThisKid.map((log) => (
              <div key={log?.id} className="log-item">
                <Link to={`/dailyLogs/${log?.id}`} className='log-item-link'>
                  {log?.image_url && (
                    <img 
                      src={log?.image_url} 
                      id='daily-log-image' 
                      alt={`${log?.title} image`} 
                    />
                  )}

                  <div className="log-details">
                    <h3 className='kidDailyLogs-log-title'>{log?.title}</h3>
                    <p className='kidDailyLogs-log-post-date'>{new Date(log?.created_at).toLocaleDateString()}</p>
                    <p className='kidDailyLogs-log-content'>{log?.content}</p>
                  </div>
                </Link>
                      
                {kid?.user_id === sessionUser?.id && (
                  <div className="update-delete-actions">
                    <button onClick={()=> navigate(`/dailyLogs/${log?.id}/update`)}className='update-action-button'>Update</button>
                    <OpenModalButton
                      className='delete-action-button'
                      buttonText='Delete'
                      modalComponent={<DeleteDailyLogModal kidId={kid?.id} dailyLogId={log?.id} />}
                    />
                  </div>
                )}

                <div id='likesAndComments-div'>
                  <LikesAndComments dailyLogId={log.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KidDailyLogs;