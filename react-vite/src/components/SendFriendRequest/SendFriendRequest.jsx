import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateFriendship } from '../../redux/friendships';
import './SendFriendRequest.css'

const SendFriendRequest = () => {
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [friendId, setFriendId] = useState('');
    const [friendship, setFriendship] = useState(null);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearchClick = async () => {
        setError('');
        setSearchResult(null);
        const res = await fetch(`/api/users/search-username?username=${query}`);
        const data = await res.json();
        if (data.errors) {
            setError(data.errors.message);
        } else {
            if (data.user_exist) {
                setSearchResult(data.user_exist);
            } else {
                setError('This user does not exist');
            }
        }  
    };
    

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        const res = await dispatch(thunkCreateFriendship(friendId));
        if (res.errors) {
            setError(res.errors.message || res.errors);
            return res.errors
        } else {
            setFriendship(res);
        }
    };

    return (
        <div id='send-friend-request-container'>
            <div className='search-by-username-div'>
                <input
                  type="text"
                  placeholder="Search for a friend by username"
                  value={query}
                  onChange={handleInputChange}
                />
                <button onClick={handleSearchClick} disabled={!query}> Search</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div>
                {searchResult ? (
                    <div>
                        <p>{searchResult.username}</p>
                        <button onClick={() => setFriendId(searchResult.id)}>Select</button>
                    </div>
                ) : (
                    query && !searchResult && !error && <p>No results found</p>
                )}
            </div>

            {searchResult && !error && (
            <form onSubmit={handleSubmit}>
                <h2>Send Friend Request</h2>
                <input
                    type="text"
                    placeholder="Friend ID"
                    value={friendId}
                    readOnly
                />
                <button type="submit" disabled={!friendId}>Send Friend Request</button>
            </form>
            )}
            {friendship && <p>Friend request sent to user with ID {friendship.friend_id}</p>}
        </div>
    );
};

export default SendFriendRequest;