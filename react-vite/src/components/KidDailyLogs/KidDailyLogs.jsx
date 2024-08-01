import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useParams} from 'react-router-dom';
import { thunkGetKidDetails } from '../../redux/kids';
import { thunkGetAllDailyLogs } from '../../redux/dailyLogs';
import { PiBabyLight } from "react-icons/pi";
import {calculateKidAgeFromBirthToNow, calculateKidAgeFromBirthToPostDate } from '../utility';
import './KidDailyLogs.css';
import LikesAndComments from '../LikesAndComments/LikesAndComments'; 

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
        <div>
            <div id='kid-icon-and-name'>  
                <PiBabyLight id='baby-icon'/>
                <h2>{kid?.name}</h2>
            </div>
            <p id='kid-age-p'>{calculateKidAgeFromBirthToNow(kid?.birth_date)}</p> 
        </div>
       
       {sessionUser.id === kid?.user_id && (
        <div>
          <button className="add-dailyLog-button" onClick={handleCreateAddDailyLog}>
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
                        <h3>Post Date: {log?.created_at}</h3>
                        <h5>{kid?.name}&apos;s Age: {calculateKidAgeFromBirthToPostDate(kid?.birth_date, log?.created_at)}</h5>
                        <h5>Title: {log?.title}</h5>
                        <p>{log?.content}</p>
                        <p className='tooltip'>Please Click here to see details</p>
                      </Link>

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