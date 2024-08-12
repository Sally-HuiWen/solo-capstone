import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useParams} from 'react-router-dom';
import { thunkGetKidDetails } from '../../redux/kids';
import { thunkGetAllDailyLogs } from '../../redux/dailyLogs';
import { PiBabyLight } from "react-icons/pi";
import {calculateKidAgeFromBirthToNow} from '../utility';
import './KidDailyLogs.css';
import LikesAndComments from '../LikesAndComments/LikesAndComments'; 
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from '../DailyLogDetails/DeleteDailyLogModal'

const KidDailyLogs = () => {
  const { kidId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector(state=> state.session.user);
  const kid = useSelector(state=> state.kids.kidDetails[kidId]);
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
            {kid?.kid_image_url? (
            <img className='kid-profile-img' src={kid.kid_image_url} />
            ): <PiBabyLight className='kid-profile-img'/> }

            <div id='kid-name-age'>
                <h2>{kid?.name}</h2>
                <p id='kid-age-p'>{calculateKidAgeFromBirthToNow(kid?.birth_date)}</p> 
            </div>
          </div>
          {kid?.user_id === sessionUser?.id && (
          <div>
            <button id="add-dailyLog-button" onClick={handleCreateAddDailyLog}>
              Add Sweet Moment
            </button>
          </div> 
          )}
      </div>
    

      <div className="daily-logs-content">
        <h2>{kid?.name}&apos;s Moments</h2>
        {allDailyLogsForThisKid.length === 0 ? (
          <p>No Moments found</p>
        ) : (
            <div>
            {allDailyLogsForThisKid?.map((log, index) => (
              <div key={log?.id || index} >
                 <div className="log-item">
                    <div className='log-image'>
                      {log?.image_url?(
                        <img src={log?.image_url} id='daily-log-image'/>
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>

                    <div className="log-details">
                      <Link to={`/dailyLogs/${log?.id}`} id='log-details-link'>
                        <h3>{log?.title}</h3>
                        <p className='post-date'>{log?.created_at}</p>
                        <p>{log?.content}</p>
                      </Link>
                      
                      {kid?.user_id === sessionUser?.id && (
                      <div className="update-delete-actions">
                        <Link to={`/dailyLogs/${log?.id}/update`}>
                            <button className='update-action'>Update</button>
                        </Link>
                        <OpenModalButton
                            className='delete-action'
                            buttonText='Delete'
                            modalComponent={<DeleteDailyLogModal kidId={kid?.id} dailyLogId={log?.id} />}
                        />
                      </div>
                      )}

                      <div id='likesAndComments-div'><LikesAndComments dailyLogId={log.id} /></div>
                    </div>
                </div>
                
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
};

export default KidDailyLogs;