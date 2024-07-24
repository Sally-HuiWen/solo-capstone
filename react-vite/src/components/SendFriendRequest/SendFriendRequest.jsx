import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateFriendship } from '../../redux/friendships';

const SendFriendRequest = () => {
    const [query, setQuery] = useState('');
    const [friendId, setFriendId] = useState('');
    const dispatch = useDispatch();
    

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(thunkCreateFriendship(friendId));
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Search for a friend by friend's username"
                    value={query}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearchClick}>Search</button>
            </div>

            <h2>Send Friend Request</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Friend ID"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Request'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {friendship && <p>Friend request sent to user with ID {friendship.friend_id}</p>}
        </div>
    );
};

export default SendFriendRequest;