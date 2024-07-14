import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { thunkGetKidDetails } from '../../redux/kids';
import { thunkGetAllDailyLogs } from '../../redux/dailyLogs';
import { PiBabyLight } from "react-icons/pi";
import calculateKidAge from '../utility';
import './KidDailyLogs.css';

// import OpenModalButton from '../OpenModalButton';
// import DeleteProductModal from './DeleteDailyLogModal';

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
    navigate('/kids/:kidId/DailyLogs/new');
  };

  return (
    <div id="daily-logs-container">

      <div className="daily-logs-header">
        <div>
            <div><PiBabyLight />{kid?.name}</div>
            <p>{calculateKidAge(kid?.birth_date)}</p> 
        </div>
       
        <div>
          <button className="add-dailyLog-button" onClick={handleCreateAddDailyLog}>
            Add Sweet Moment
          </button>
        </div> 
      </div>
    

      <div className="daily-logs-content">
        <h2>{kid?.name}'s Moments</h2>
        {allDailyLogsForThisKid.length === 0 ? (
          <p>No Moments found</p>
        ) : (
          <ul>
            {allDailyLogsForThisKid?.map((log, index) => (
              <li key={log?.id || index} className="log-item">
                <div className='log-image'>
                  {log?.images?.filter(image=>image.preview)?.length > 0? (
                    <img src={log.images.filter(image => image.preview)[0].url} alt={log?.name} />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
                <div className="log-details">
                  <h2>{log?.created_at}</h2>
                  <p>{kid?.birthday}</p>
                  <p>{log?.content}</p>
                  <div className="listing-actions">
                    <Link to={`/DailyLogs/${log?.id}/update`}>
                      <button>Update</button>
                    </Link>
                    {/* <OpenModalButton
                      buttonText='Delete'
                      modalComponent={<DeleteDailyLogModal dailyLogId={log?.id} />}
                    /> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  )


};



export default KidDailyLogs;