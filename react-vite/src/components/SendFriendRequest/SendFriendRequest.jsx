import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateFriendship, thunkGetCurrentUserFriendships } from '../../redux/friendships';
import { thunkAuthenticate } from '../../redux/session';
import './SendFriendRequest.css';
import { FaUserCircle } from 'react-icons/fa';

const SendFriendRequest = () => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const currentUserFriendships = useSelector(state => state.friendships.currentUserFriendships || []);
    // console.log('what is currentUserFriendships', currentUserFriendships);

    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState('');

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


    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = async () => {
        setErrors([]);
        setSearchResult([]);

        if (query.trim() === '') {
            setErrors(["Please enter a name to search."]);
            setQuery(''); // clear the input field
            return;
        }
        const trimmedQuery = query.trim().toLowerCase();
        const res = await fetch(`/api/users/search?query=${trimmedQuery}`);
        const data = await res.json();
        if (data.errors) {
            setErrors([data.errors.message]);
            setQuery(''); // clear the input field
        } else {
            if (data.users_exist) {
                setSearchResult(data.users_exist);
            } else {
                setErrors(['This user found! Please try another name.']);
                setQuery(''); // clear the input field
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch();
        }
    }

    const handleSubmit = async (userId, firstName, lastName) => {
        if (userId === sessionUser?.id) {
            setErrors(['You cannot send a friend request to yourself.']);
            setSearchResult([]); // clear search result if trying to send request to self
            setQuery(''); // clear the input field
            return;
        }
        // not apply to useEffect, put it here; This ensures that the frontend logic runs before the backend logic.
        const current = currentUserFriendships.find(friendship =>
            (friendship.user_id === sessionUser?.id && friendship.friend_id === userId) ||
            (friendship.user_id === userId && friendship.friend_id === sessionUser?.id)
        );
    
        if (current) {
            setErrors(['Friendship already exists. Please try another name.']);
            setSearchResult([]); // clear search result if friendship exists
            setQuery(''); // clear the input field
            return;
        }

        const res = await dispatch(thunkCreateFriendship(userId));
        if (res.errors) {
            setErrors([res.errors.message || res.errors]);
        } else {
            setMessage(`Friend request sent successfully to ${firstName} ${lastName}!`);
            setSearchResult([]); // clear search result after sending request
            // reset state after 5 seconds
            setTimeout(() => {
                setMessage('');
                setErrors([]);
                setQuery('');
            },3000);
        }
    };

    return (
        <div id='send-friend-request-container'>
            <input
                type="text"
                placeholder="Search for a user by first name or last name"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            
            {errors.length > 0 && (
                <p className="error-message">{errors[0]}</p>
            )}
            {searchResult?.length > 0 && errors?.length === 0 && (
                <>
                    <h3>Search Results</h3>
                    {searchResult?.map((person, index)=> (
                        <div key={person.id || index} className='each-person'>
                           <div className='person-image-name'>
                             {person?.user_image_url? (
                              <img className="person-profile-image" src={person?.user_image_url} alt="Person Profile Image" />
                             ) : (
                             <FaUserCircle className='person-profile-icon'/>
                             )}
                             <p className='span-span'>{person.first_name} {person.last_name}</p>
                           </div>
                           <button className='add-friend-button' onClick={() => handleSubmit(person.id, person.first_name, person.last_name)}>Add friend</button>
                        </div>   
                    ))}   
                </>
            )}
            {message && <p id="success-message">{message}</p>}
        </div>
    );
};

export default SendFriendRequest;