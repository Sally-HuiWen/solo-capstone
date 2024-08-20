import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentKids } from '../../redux/kids';
import './CurrentUserKids.css';
import OpenModalButton from '../OpenModalButton';
import RemoveKidModal from './RemoveKidModal'
import { calculateKidAgeFromBirthToNow }from '../utility';
import { FaUserFriends } from "react-icons/fa";
import { PiBabyThin } from "react-icons/pi";

const CurrentUserKids = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const kids = useSelector(state => state.kids.currentUserKids || []);
    useEffect(() => {
        dispatch(thunkGetCurrentKids());
    }, [dispatch]);

    const handleAddNewKid = () => {
        navigate('/kids/add-new')
    };

    const handleFriends = () => {
        navigate('/current/friends')
    }

    return (
          <div id='kids-list-container'>
            <div id='my-kids-and-friends'>
              <h1 id='my-kids-h1'>My Kids</h1>
              <button id='friends-button' onClick={handleFriends}>
                <FaUserFriends id='friends-icon'/>
                <span>Friends</span>
              </button>
            </div>
            
            <div >
                <button onClick={handleAddNewKid} id='add-kid-button'>
                    Add Kid
                </button>
            </div>
            <div className='your-kids-content'>
                {kids.length === 0 ? (
                    <p className='no-kids-found'>No kids found. Please add your kid.</p>
                ):(
                    <div id='kids-list-box'>
                        {kids.map((kid, index)=> (
                            <div key={kid?.id || index} className='kid-details'>
                                   <Link to={`/kids/${kid?.id}/dailyLogs`} className='Link-link'>
                                        <div className='image-and-name-div'>
                                            {kid?.kid_image_url? (
                                              <img className='kid-profile-image' src={kid?.kid_image_url}/>  
                                            ): (<PiBabyThin className='kid-profile-icon'/>)}
                                        </div>

                                        <div>
                                            <h2 id='kid-name-h2'>{kid?.name}</h2> 
                                            <h4 id='kid-age-h4'>{calculateKidAgeFromBirthToNow(kid?.birth_date)}</h4> 
                                        </div>
                                        
                                        <div className='tooltip'>click here to see {kid?.name}&apos;s dailyLogs</div>
                                    </Link>
                                    <div className='update-and-remove-box'>
                                        <Link to={`/kids/${kid?.id}/update`} className='Link-link'>
                                        <button className='kid-update-button'>Update</button>
                                        </Link>
                                        <OpenModalButton
                                        className='remove-kid-button'
                                        buttonText='Remove'
                                        modalComponent={<RemoveKidModal kidId={kid?.id} />}
                                        />
                                    </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
    )
}

export default CurrentUserKids;