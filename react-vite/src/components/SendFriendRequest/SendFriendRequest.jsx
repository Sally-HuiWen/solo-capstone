import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateFriendship, thunkGetCurrentUserFriendships } from '../../redux/friendships';
import { thunkAuthenticate } from '../../redux/session';
import './SendFriendRequest.css';
import { useNavigate } from 'react-router-dom';

const SendFriendRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session.user);
    const currentUserFriendships = useSelector(state => state.friendships.currentUserFriendships || []);
    console.log('what is currentUserFriendships', currentUserFriendships)

    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [friendId, setFriendId] = useState('');
    const [currentFriendship, setCurrentFriendship] = useState(false);
    const [friendship, setFriendship] = useState(null);
    const [errors, setErrors] = useState([]);
    const [hasClicked, setHasClicked] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        // Ensure authentication before fetching friendships
        const authenticateAndFetchFriendships = async () => {
            const authRes = await dispatch(thunkAuthenticate());
            if (!authRes?.errors) {
                dispatch(thunkGetCurrentUserFriendships());
            } else {
                setErrors(['Failed to authenticate. Please log in again.']);
            }
        };
        authenticateAndFetchFriendships();
    }, [dispatch]);

    useEffect(() => {
        if (friendId) {
            const current = currentUserFriendships.find(friendship =>
                (friendship.user_id === sessionUser?.id && friendship.friend_id === friendId) ||
                (friendship.user_id === friendId && friendship.friend_id === sessionUser?.id)
            );
            console.log('what is current', current)
            if (current) {
                setCurrentFriendship(true);

            }
        }
    }, [friendId, currentUserFriendships, sessionUser?.id]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearchClick = async () => {
        setErrors([]);
        setSearchResult(null);
        setHasClicked(true);

        if (query.trim() === '') {
            setErrors(["Please enter a friend's username to search."]);
            return;
        }

        const res = await fetch(`/api/users/search-username?username=${query}`);
        const data = await res.json();
        if (data.errors) {
            setErrors([data.errors.message]);
        } else {
            if (data.user_exist) {
                setSearchResult(data.user_exist);
            } else {
                setErrors(['This user does not exist! Please try another username.']);
            }
        }
    };

    const handleSelectFriend = (id) => {
        setFriendId(id);
        setErrors([]); // clear errors related to selecting a friend
    };

    const handleExit = () => {
        console.log('Exit clicked');
        navigate('/your-kids-list'); 
    };

    const handleReset = () => {
    // reset the state to its initial values
        setCurrentFriendship(false);
        setFriendId('');
        setSearchResult(null);
        setHasClicked(false); // make sure only search-related-div is shown after click on reset button
        setErrors([]);
        console.log('Reset clicked');
    };

    const handleSendMore= () => {
        // reset the state to its initial values
        setCurrentFriendship(false);
        setFriendId('');
        setSearchResult(null);
        setHasClicked(false); 
        setHasSubmitted(false); // clear submission state
        setErrors([]);
        console.log(' send more clicked');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

         // Check if the user is trying to send a friend request to themselves
        if (friendId === sessionUser?.id) {
            setErrors(['You cannot send a friend request to yourself.']);
            setHasSubmitted(false); 
            return;
        }

        const res = await dispatch(thunkCreateFriendship(friendId));
        if (res.errors) {
            setErrors([res.errors.message || res.errors]);
        } else {
            setFriendship(res);
        }
    };

    return (
        <div id='send-friend-request-container'>
            <div id='search-by-username-div'>
                <h3>Check if username exists</h3>
                <input
                    type="text"
                    placeholder="Search for a friend by username"
                    value={query}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearchClick}>Search</button>
            </div>
             {hasClicked && errors.includes("Please enter a friend's username to search.") && (
                <p className="error-message">Please enter a friend&apos;s username to search.</p>
            )}
            <div>
                {searchResult? (
                    <div id='search-result-div'>
                        <h3>Friend exists: {searchResult.username}</h3>
                        <button onClick={() => handleSelectFriend(searchResult.id)}>Select</button>
                    </div>
                ) : hasClicked && errors.includes('This user does not exist! Please try another username.') && (
                <p className="error-message">This user does not exist! Please try another username.</p>
                )}
            </div>
            {friendId && errors.includes('You cannot send a friend request to yourself.') && (<p className="error-message">You cannot send a friend request to yourself.</p>)}
            {friendId && currentFriendship && (
                <div id='check-currentFriendship-div'>
                    <h3>Check if current friendship exists: Yes</h3>
                    <button onClick={handleExit}>Exit</button>
                    <button onClick={handleReset}>Reset</button>
                </div>
            )}

            {friendId && !currentFriendship && errors.length === 0 && (
                <form onSubmit={handleSubmit}>
                    <h2>Send Friend Request</h2>
                    <input
                        type="text"
                        placeholder="Friend ID"
                        value={friendId}
                        readOnly
                    />
                    <button type="submit">Send Friend Request</button>
                </form>
            )}
            {/* {errors.length > 0 && (
                <div className="errors">
                    {errors.map((error, idx) => (
                        <p key={idx} className="error-message">{error}</p>
                    ))}
                </div>
            )} */}
            {hasSubmitted && friendship && errors.length === 0 && (
                <div>
                    <h3>Friend request sent successfully to {searchResult?.username || 'user'} with id {friendship.friend_id}!</h3>
                    <button onClick={handleExit}>Exit</button>
                    <button onClick={handleSendMore}>send another friend request</button>
                </div>
            )}
        </div>
    );
};

export default SendFriendRequest;