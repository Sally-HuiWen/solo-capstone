import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams} from 'react-router-dom';
import { thunkGetFriendsKidsDailyLogs} from '../../redux/friendships';
import { thunkGetKidDetails } from '../../redux/kids';
import { PiBabyLight } from "react-icons/pi";
import {calculateKidAgeFromBirthToNow, calculateKidAgeFromBirthToPostDate } from '../utility';
import './FriendKidDailyLogs.css';

const FriendKidDailyLogs = () => {
  const dispatch = useDispatch();
  const { kidId } = useParams();
  const kid = useSelector(state => state.kids.kidDetails[kidId]);
  console.log('who is the kid in FriendKidDailyLogs.jsx', kid)
  const friendKidDailyLogs = useSelector(state => state.friendships.friendsKidsDailyLogs[kidId] || []);
  console.log('what is  friendKidDailyLogs', friendKidDailyLogs)

  useEffect(() => {
    if (kidId) {
        dispatch(thunkGetKidDetails(kidId));
    }
  }, [dispatch, kidId]);


  useEffect(() => {
    if (kidId) {
        dispatch(thunkGetFriendsKidsDailyLogs(kidId));
    }
  }, [dispatch, kidId]);


  return (
    <div id="daily-logs-container">

      <div className="daily-logs-header">
        <div id='kid-icon-and-name'>  
            <PiBabyLight id='baby-icon'/>
            <h2>{kid?.name}</h2>
        </div>
        <p id='kid-age-p'>{calculateKidAgeFromBirthToNow(kid?.birth_date)}</p> 
      </div>
    

      <div className="daily-logs-content">
        <h2>{kid?.name}&apos;s Moments</h2>
        {friendKidDailyLogs.length === 0 ? (
          <p>No Moments found</p>
        ) : (
            <div>
            {friendKidDailyLogs?.map((log, index) => (
              <div key={log?.id || index} >
                <Link to={`/dailyLogs/${log?.id}`} className="log-item">
                  <div className='log-image'>
                    {log?.image_url?(
                      <img src={log?.image_url} id='daily-log-image'/>
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                  <div className="log-details">
                    <h3>Post Date: {log?.created_at}</h3>
                    <h5>{kid?.name}&apos;s Age: {calculateKidAgeFromBirthToPostDate(kid?.birth_date, log?.created_at)}</h5>
                    <h5>Title: {log?.title}</h5>
                    <p>{log?.content}</p>
                    <p className='tooltip'>Please Click here to see details</p>
                  </div>
                  </Link>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>

  )


};



export default FriendKidDailyLogs;