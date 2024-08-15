import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentUserFriendships, thunkGetFriends, thunkUpdateFriendship, thunkDeleteFriendship } from '../../redux/friendships';
import './CurrentUserFriends.css';
import { FaUserCircle } from 'react-icons/fa';

const CurrentUserFriends = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const confirmedFriends = useSelector(state => state.friendships.confirmedFriends || []);
    const pendingFriends = useSelector(state => state.friendships.pendingFriends || []);
    const deniedFriends = useSelector(state => state.friendships.deniedFriends || []);
    const currentUserFriendships = useSelector(state => state.friendships.currentUserFriendships || []);

    useEffect(() => {
        dispatch(thunkGetFriends());
    }, [dispatch]);

    useEffect(() => {
        dispatch(thunkGetCurrentUserFriendships());
    }, [dispatch]);
    
    const handleAddFriend = () => {
        navigate('/friendships/new');
    };

    const handleAcceptRequest = async (friendshipId) => {
        const res = await dispatch(thunkUpdateFriendship(friendshipId, 'accepted'));
        if (res?.errors) {
            console.error('Error accepting friend request:', res?.errors);
        } else {
            dispatch(thunkGetFriends()); // ensure this updates the confirmed friends list
            dispatch(thunkGetCurrentUserFriendships()); // refresh friendships
        }
    };

    const handleDenyRequest = async (friendshipId) => {
        const res = await dispatch(thunkUpdateFriendship(friendshipId, 'denied'));
        if (res?.errors) {
            console.error('Error denying friend request:', res?.errors);
        } else {
            dispatch(thunkGetCurrentUserFriendships()); // refresh friendships
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
        (friendship.friend_id === sessionUser?.id) && (friendship.status === 'pending') 
    );
    
    // filter out the sent friend requests from the currentUserFriends list
    const sentFriendRequests = currentUserFriendships.filter(friendship =>
        (friendship.user_id === sessionUser?.id) && (friendship.status === 'pending')
    ); 

    const deniedSentRequests = currentUserFriendships.filter(friendship =>
        (friendship.user_id === sessionUser?.id) && (friendship.status === 'denied')
    );

    const getUserById = (id) => {
        return [...pendingFriends, ...confirmedFriends, ...deniedFriends].find(friend => friend.id === id) || null;
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
        <div id='three-lists'>
            <div id='friends-container'>
                <div id='friends-list-container'>
                    <h3>All Friends</h3>
                    <div >
                        <button onClick={handleAddFriend} id='add-new-friend-button'>
                            Add a new friend
                        </button>
                    </div>
                </div>
                {confirmedFriends.length === 0 ? (
                    <p>No friends found</p>
                ) : (
                    confirmedFriends.map((friend, index) => (
                    <div key={friend.id || index} className='each-friend'>
                        <div className='friend-info-div'>
                            {friend?.user_image_url ? (
                            <img className="friend-profile-image" src={friend?.user_image_url} alt="Friend Profile Image" />
                            ) : (
                            <FaUserCircle className='friend-profile-icon'/>
                            )}
                            <div>
                                <h4>{friend.username}</h4>
                                {friend?.kids?.map((kid, kidIndex) => (
                                <div key={kid.id || kidIndex} className='each-kid'>
                                    <Link to={`/kids/${kid?.id}/dailyLogs`} className='Link-friend-kid'>
                                        <div className='friend-kid-div'>
                                           <p>kid: {kid.name}</p>  
                                           {kid?.kid_image_url && (<img className='friend-kid-image' src={kid?.kid_image_url} alt="Kid Profile Image"/>)}
                                        </div>
                                        <div className='tooltip'>click here to see {kid?.name}&apos;s dailyLogs</div>
                                    </Link>
                                </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <button className='remove-friend-button' onClick={() => handleRemoveFriend(friend.id)}>Remove friend</button>
                        </div>
                        
                    </div>
                    ))
                )}
            </div>
          
            <div id='request-received-container'>
            {receivedFriendRequests.length === 0 ? (
                <h3>No friend requests received</h3>
                ) : (
                <div className='friend-request-div'>
                    <h3>Friend Requests</h3>
                    <div id='requests-received-box'>
                        {receivedFriendRequests.map((friendship, index) => {
                            const friend = getUserById(friendship.user_id);
                            return (
                            <div key={friendship.id || index} className='each-request-friend'>
                                <div className='request-friend-info-div'>
                                    {friend?.user_image_url ? (
                                    <img className="friend-profile-image" src={friend?.user_image_url} alt="Friend Profile Image" />
                                    ) : (
                                    <FaUserCircle className='friend-profile-icon'/>
                                    )}
                                  <h4>{friend?.username}</h4> 
                                </div>
                                <div className='accept-and-deny-buttons'>
                                    <button className='accept-friend-request-button' onClick={() => handleAcceptRequest(friendship.id)}>Accept</button>
                                    <button className='deny-friend-request-button' onClick={() => handleDenyRequest(friendship.id)}>Deny</button>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                
               </div>
                )}
            </div>

            <div id='request-send-container'>
                {sentFriendRequests.length === 0 && deniedSentRequests.length === 0 ? (
                    <h3>No sent friend requests</h3>
                ) : (
                    <div className='sent-request-div'>
                        <h3>You Sent A Friend Request To</h3>
                        <div id='sent-request-box'>
                        {sentFriendRequests.map((friendship, index) => {
                            const friend = getUserById(friendship.friend_id);
                            return (
                            <div key={friendship.id || index} className='each-request-friend'>
                                <div className='request-friend-info-div'>
                                    {friend?.user_image_url ? (
                                    <img className="friend-profile-image" src={friend?.user_image_url} alt="Friend Profile Image" />
                                    ) : (
                                    <FaUserCircle className='friend-profile-icon'/>
                                    )}
                                  <h4>{friend?.username}</h4> 
                                </div>
                                <div >
                                    <button className='cancel-friend-request-button' onClick={() => handleDeleteRequest(friendship.id)}>Cancel Request</button>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                        {deniedSentRequests.length > 0 && (
                            <div>
                            {deniedSentRequests.map((friendship, index) => {
                                const friend = getUserById(friendship.friend_id);
                                return (
                                    <div key={friendship.id || index} className='each-request-friend'>
                                        <div className='request-friend-info-div'>
                                            {friend?.user_image_url ? (
                                                <img className="friend-profile-image" src={friend?.user_image_url} alt="Friend Profile Image" />
                                                ) : (
                                                <FaUserCircle className='friend-profile-icon'/>
                                            )}
                                            <h4>{friend?.username}</h4> 
                                        </div>
                                            
                                        <div className='denied-label'>Denied</div>
                                        <button className='delete-friend-request-button'onClick={() => handleDeleteRequest(friendship.id)}>Delete Request</button>
                                        
                                    </div>
                                );
                            })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CurrentUserFriends;