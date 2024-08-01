import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateFriendship, thunkGetCurrentUserFriendships } from '../../redux/friendships';
import { thunkAuthenticate } from '../../redux/session';
import './SendFriendRequest.css';

const SendFriendRequest = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const currentUserFriendships = useSelector(state => state.friendships.currentUserFriendships || []);
    // console.log('what is currentUserFriendships', currentUserFriendships);

    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [friendId, setFriendId] = useState('');
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState('');
    const [hasClicked, setHasClicked] = useState(false);

    useEffect(() => {
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
            if (current) {
                setErrors(['Friendship already exists. Please try another username.']);
                setFriendId('');
                setSearchResult(null); // clear search result if friendship exists
                setQuery(''); // clear the input field
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
            setQuery(''); // clear the input field
            return;
        }
        const queryAllCases = query.trim().toLowerCase();
        const res = await fetch(`/api/users/search-username?username=${queryAllCases}`);
        const data = await res.json();
        if (data.errors) {
            setErrors([data.errors.message]);
            setQuery(''); // clear the input field
        } else {
            if (data.user_exist) {
                setSearchResult(data.user_exist);
                setFriendId(data.user_exist.id);
            } else {
                setErrors(['This user does not exist! Please try another username.']);
                setQuery(''); // clear the input field
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (friendId === sessionUser?.id) {
            setErrors(['You cannot send a friend request to yourself.']);
            setSearchResult(null); // clear search result if trying to send request to self
            setQuery(''); // clear the input field
            return;
        }

        const res = await dispatch(thunkCreateFriendship(friendId));
        if (res.errors) {
            setErrors([res.errors.message || res.errors]);
        } else {
            setMessage(`Friend request sent successfully to ${searchResult.username}!`);
            setSearchResult(null); // clear search result after sending request
            // reset state after 5 seconds
            setTimeout(() => {
                setMessage('');
                setErrors([]);
                setQuery('');
                setFriendId('');
                setHasClicked(false);
            },3000);
        }
    };

    return (
        <div id='send-friend-request-container'>
            <div id='search-by-username-div'>
                <h3>Check if the user exists</h3>
                <input
                    type="text"
                    placeholder="Search for a user by username"
                    value={query}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearchClick}>Search</button>
            </div>

            {hasClicked && errors.length > 0 && (
                <p className="error-message">{errors[0]}</p>
            )}
            {searchResult &&!errors.includes('You cannot send a friend request to yourself.') && !errors.includes('Friendship already exists. Please try another username.') && (
                <div id='search-result-div'>
                    <h3>Send {searchResult.username} a friend request</h3>
                    <button onClick={handleSubmit}>Send</button>
                </div>
            )}
            {message && <p id="success-message">{message}</p>}
        </div>
    );
};

export default SendFriendRequest;