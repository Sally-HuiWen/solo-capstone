import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentKids } from '../../redux/kids';
import { thunkGetCurrentUserFriendships, thunkGetFriends, thunkUpdateFriendship, thunkDeleteFriendship } from '../../redux/friendships';
import './CurrentUserKids.css';
import OpenModalButton from '../OpenModalButton';
import RemoveKidModal from './RemoveKidModal'
import { calculateKidAgeFromBirthToNow }from '../utility';

const CurrentUserKids = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const kids = useSelector(state => state.kids.currentUserKids || []);
    const sessionUser = useSelector(state => state.session.user);
    const confirmedFriends = useSelector(state => state.friendships.confirmedFriends || []);
    const pendingFriends = useSelector(state => state.friendships.pendingFriends || []);
    const currentUserFriendships = useSelector(state => state.friendships.currentUserFriendships|| [])
    console.log('who are your confirmedFriends', confirmedFriends)
    console.log('who are your pendingFriends', pendingFriends)

    useEffect(() => {
        dispatch(thunkGetCurrentKids());
    }, [dispatch]);
    
    useEffect(() => {
        dispatch(thunkGetFriends());
    }, [dispatch]);

    useEffect(() => {
        dispatch(thunkGetCurrentUserFriendships());
    }, [dispatch]);

    const handleAddNewKid = () => {
        navigate('/kids/add-new')
    };

    const handleAddFriend = () => {
        navigate('/friendships/new')
    }

    const handleConfirmRequest = async (friendshipId) => {
        const res = await dispatch(thunkUpdateFriendship(friendshipId));
        if (res?.errors) {
            console.error('Error confirming friend request:', res?.errors);
        } else {
            dispatch(thunkGetCurrentUserFriendships()); // Refresh friendships
        }
    };

    const handleDeleteRequest = async (friendshipId) => {
        const res = await dispatch(thunkDeleteFriendship(friendshipId));
        if (res?.errors) {
            console.error('Error deleting friend request:', res?.errors);
        } else {
            dispatch(thunkGetCurrentUserFriendships()); // Refresh friendships
        }
    };

    // filter out the received friend requests from the currentUserFriends list
    const receivedFriendRequests = currentUserFriendships.filter(friendship =>
        (friendship.friend_id === sessionUser?.id) && (friendship.pending === true) 
    );

    const getUsernameById = (id) => {
        const friend = pendingFriends.find(friend => friend.id === id);
        return friend ? friend.username : 'Unknown';
    };

    const handleRemoveFriend = async (friendId) => {
        // find the friendshipId based on the friendId
        const friendship = currentUserFriendships.find(friendship=> 
            friendship.friend_id === friendId || friendship.user_id === friendId
        );
      
        if (!friendship) {
          console.error('Friendship not found');
          return;
        }
      
        const res = await dispatch(thunkDeleteFriendship(friendship.id));
        if (res?.errors) {
          console.error('Error removing friend:', res?.errors);
        } else {
          dispatch(thunkGetCurrentUserFriendships()); // refresh friendships
        }
      };

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
                                    <div className='update-and-remove-box'>
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
                    <div className='friend-info-div'>
                        <h4>Friend: {friend.username}</h4>
                        <button className='button-button' onClick={() => handleRemoveFriend(friend.id)}>remove</button>
                    </div>
                    {friend?.kids?.map((kid, kidIndex) => (
                        <div key={kid.id || kidIndex} className='each-kid'>
                            <Link to={`/kids/${kid?.id}/dailyLogs`} className='Link-link'>
                              <p>{friend.username}&apos;s kid: {kid.name}</p>
                              <p className='tooltip'>click here to see {kid?.name}&apos;s dailyLogs</p>
                            </Link>
                        </div>
                    ))}
                </div>
                ))
            )}
          </div>
          
          <div id='friend-request-container'>
          {receivedFriendRequests.length === 0 ? (
             <h1>No friend requests received</h1>
            ) : (
            <div id='friend-request-div'>
            <h1>Friend Requests</h1>
            {receivedFriendRequests.map((friendship, index) => (
                <div key={friendship.id || index} className='each-friend'>
                    <h4>{getUsernameById(friendship.user_id)}</h4>
                    <div className='update-and-remove-box'>
                    <button onClick={() => handleConfirmRequest(friendship.id)}>Confirm</button>
                    <button onClick={() => handleDeleteRequest(friendship.id)}>Delete</button>
                    </div>
                </div>
            ))}
           </div>
          )}
           </div>
        </div>
    )
}

export default CurrentUserKids