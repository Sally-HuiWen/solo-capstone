import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { thunkGetKidDetails } from '../../redux/kids';
import { thunkGetAllDailyLogs } from '../../redux/dailyLogs';
import { PiBabyLight } from "react-icons/pi";
import {calculateKidAgeFromBirthToNow, calculateKidAgeFromBirthToPostDate }from '../utility';
import './KidDailyLogs.css';
import OpenModalButton from '../OpenModalButton';
import DeleteDailyLogModal from './DeleteDailyLogModal';

const KidDailyLogs = () => {
  const { kidId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const kid = useSelector(state=> state.kids.kidDetails[kidId])
  console.log('who is  this kid', kid)
  const allDailyLogsForThisKid = useSelector(state => state.dailyLogs.allDailyLogs[kidId] || []);
  console.log('what is dailyLogs', allDailyLogsForThisKid)
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
                <PiBabyLight />
                <h2>{kid?.name}</h2>
            </div>
            <p>{calculateKidAgeFromBirthToNow(kid?.birth_date)}</p> 
        </div>
       
        <div>
          <button className="add-dailyLog-button" onClick={handleCreateAddDailyLog}>
            Add Sweet Moment
          </button>
        </div> 
      </div>
    

      <div className="daily-logs-content">
        <h2>{kid?.name}&apos;s Moments</h2>
        {allDailyLogsForThisKid.length === 0 ? (
          <p>No Moments found</p>
        ) : (
            <div>
            {allDailyLogsForThisKid?.map((log, index) => (
              <div key={log?.id || index} className="log-item">
                <div className='log-image'>
                  {log?.images?.filter(image=>image.preview)?.length > 0? (
                    <img src={log.images.filter(image => image.preview)[0].url} alt={log?.name} id='daily-log-image'/>
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <div className="log-details">
                  <h3>Post Date: {log?.created_at}</h3>
                  <p>{kid?.name}&apos;s Age: {calculateKidAgeFromBirthToPostDate(kid?.birth_date, log?.created_at)}</p>
                  <p>Title: {log?.title}</p>
                  <p>{log?.content}</p>
                  <div className="update-delete-actions">
                    <Link to={`/DailyLogs/${log?.id}/update`}>
                      <button>Update</button>
                    </Link>
                    <OpenModalButton
                      buttonText='Delete'
                      modalComponent={<DeleteDailyLogModal dailyLogId={log?.id} />}
                    />
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