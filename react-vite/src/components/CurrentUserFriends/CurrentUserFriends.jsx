import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentUserFriendships, thunkGetFriends, thunkUpdateFriendship, thunkDeleteFriendship } from '../../redux/friendships';
import './CurrentUserFriends.css'

const CurrentUserFriends = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const confirmedFriends = useSelector(state => state.friendships.confirmedFriends || []);
    const pendingFriends = useSelector(state => state.friendships.pendingFriends || []);
    const currentUserFriendships = useSelector(state => state.friendships.currentUserFriendships|| [])
    console.log('who are your confirmedFriends', confirmedFriends)
    console.log('who are your pendingFriends', pendingFriends)

    useEffect(() => {
        dispatch(thunkGetFriends());
    }, [dispatch]);

    useEffect(() => {
        dispatch(thunkGetCurrentUserFriendships());
    }, [dispatch]);
    
    const handleAddFriend = () => {
        navigate('/friendships/new')
    }

    const handleConfirmRequest = async (friendshipId) => {
        const res = await dispatch(thunkUpdateFriendship(friendshipId));
        if (res?.errors) {
            console.error('Error confirming friend request:', res?.errors);
        } else {
            dispatch(thunkGetFriends()); // Ensure this updates the confirmed friends list
            dispatch(thunkGetCurrentUserFriendships()); // Refresh friendships
        }
    };

    const handleDeleteRequest = async (friendshipId) => {
        const res = await dispatch(thunkDeleteFriendship(friendshipId));
        if (res?.errors) {
            console.error('Error deleting friend request:', res?.errors);
        } else {
            dispatch(thunkGetFriends()); 
            dispatch(thunkGetCurrentUserFriendships()); 
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
            dispatch(thunkGetFriends()); 
            dispatch(thunkGetCurrentUserFriendships()); 
        }
    };

    return (
        <div id='friends-container'>
            <div id='friends-list-container'>
            <h2>Your Friends List</h2>
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
             <h2>No friend requests received</h2>
            ) : (
            <div id='friend-request-div'>
            <h2>Friend Requests</h2>
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

export default CurrentUserFriends;
