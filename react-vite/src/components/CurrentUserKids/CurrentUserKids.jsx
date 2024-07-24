import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentKids } from '../../redux/kids';
import { thunkGetFriends } from '../../redux/friendships';
import './CurrentUserKids.css';
import OpenModalButton from '../OpenModalButton';
import RemoveKidModal from './RemoveKidModal'
import { calculateKidAgeFromBirthToNow }from '../utility';

const CurrentUserKids = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const kids = useSelector(state => state.kids.currentUserKids || []);

    const confirmedFriends = useSelector(state => state.friendships.confirmedFriends || []);
    console.log('who are your confirmedFriends', confirmedFriends)

    useEffect(() => {
        dispatch(thunkGetCurrentKids());
    }, [dispatch]);
    
    useEffect(() => {
        dispatch(thunkGetFriends());
    }, [dispatch]);

    const handleAddNewKid = () => {
        navigate('/kids/add-new')
    };

    const handleAddFriend = () => {
        navigate('/friendships/new')
    }

    return (
        <div id='kids-and-friends-container'>
          <div id='kids-list-container'>
            <h1>Your Kids</h1>
            <div >
                <button onClick={handleAddNewKid} id='add-kid-button'>
                    Add my new kid
                </button>
            </div>
            <div className='your-kids-content'>
                {kids.length === 0 ? (
                    <p>No kids found. Please add your kid by click the button</p>
                ):(
                    <div id='kids-list-box'>
                        {kids.map((kid, index)=> (
                            <div key={kid?.id || index} className='kid-details'>
                                   <Link to={`/kids/${kid?.id}/dailyLogs`} className='Link-link'>
                                        <h2>{kid?.name}</h2>
                                        <p>{calculateKidAgeFromBirthToNow(kid?.birth_date)}</p>
                                        <p className='tooltip'>click here to see {kid?.name}&apos;s dailyLogs</p>
                                    </Link>
                                    <div id='update-and-remove-box'>
                                        <Link to={`/kids/${kid?.id}/update`} className='Link-link'>
                                        <button>Update</button>
                                        </Link>
                                        <OpenModalButton
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
          <div id='friends-list-container'>
            <h1>Your Friends List</h1>
            <div >
                <button onClick={handleAddFriend} id='add-new-friend-button'>
                    Add a new friend
                </button>
            </div>
            {confirmedFriends.length === 0 ? (
                <p>No friends found</p>
            ) : (
                confirmedFriends.map((friend, index) => (
                <div key={friend.id || index} className='each-friend'>
                    <h4>Friend Name: {friend.username}</h4>
                    {friend?.kids?.map((kid, kidIndex) => (
                        <div key={kid.id || kidIndex} className='each-kid'>
                            <Link to={`/kids/${kid?.id}/dailyLogs`} className='Link-link'>
                              <p>{friend.username}&apos;s kid name: {kid.name}</p>
                              <p className='tooltip'>click here to see {kid?.name}&apos;s dailyLogs</p>
                            </Link>
                        </div>
                    ))}
                </div>
                ))
            )}
          </div>
        </div>
    )
}

export default CurrentUserKids