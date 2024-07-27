const GET_FRIENDS = 'friendships/get_friends';
const ADD_FRIENDSHIP = 'friendships/add_friendship';
const UPDATE_FRIENDSHIP = 'friendships/update_';
const DELETE_FRIENDSHIP = 'friendships/delete';
const CURRENT_USER_FRIENDSHIPS = 'friendships/current';

const getFriends = (friends) => ({
  type: GET_FRIENDS,
  friends,
});

const addFriendship = (friendship) => ({
  type: ADD_FRIENDSHIP,
  friendship
});

const updateFriendship= (friendship) => ({
  type: UPDATE_FRIENDSHIP,
  friendship
});

const deleteFriendship = (friendshipId) => ({
  type: DELETE_FRIENDSHIP,
  friendshipId
});

const getCurrentUserFriendships = (friendships) => ({
  type: CURRENT_USER_FRIENDSHIPS,
  friendships,
});

export const thunkGetFriends = () => async (dispatch) => {
  const res = await fetch('/api/users/friends');
  if (res.ok) {
    const friends = await res.json();
    console.log('what is thunk friends', friends)
    dispatch(getFriends(friends));
  }
};

export const thunkCreateFriendship = (friendId) => async (dispatch) => {
  const res = await fetch('/api/friendships/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ friend_id: friendId }),
  });
  if (res.ok) {
    const friendship = await res.json();
    dispatch(addFriendship(friendship));
    return friendship
  } else {
    const error = await res.json()
    return error
  }
};

export const thunkUpdateFriendship = (friendshipId) => async (dispatch) => {
  const res = await fetch(`/api/friendships/${friendshipId}/update`, {
    method: 'PUT',
  });
  if (res.ok) {
    const friendship = await res.json();
    dispatch(updateFriendship(friendship));
    return friendship;
  } else {
    const error = await res.json()
    return error
  }
};

export const thunkDeleteFriendship = (friendshipId) => async (dispatch) => {
  const res = await fetch(`/api/friendships/${friendshipId}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    dispatch(deleteFriendship(friendshipId));
  }
};

export const thunkGetCurrentUserFriendships = () => async (dispatch) => {
  const res = await fetch('/api/friendships/current');
  if (res.ok) {
    const data = await res.json();
    dispatch(getCurrentUserFriendships(data));
  } else {
    const error = await res.json();
    return error;      
  }
};

const initialState = {
  pendingFriends: [],
  confirmedFriends: [],
  currentUserFriendships: [],
};

const friendshipsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FRIENDS:
      return {
        ...state,
        pendingFriends: action.friends.pending_friends,
        confirmedFriends: action.friends.confirmed_friends,
      };
    case ADD_FRIENDSHIP:
      // Assume a new friendship is always a pending friend request
      return {
        ...state,
        pendingFriends: [...state.pendingFriends, action.friendship],
      };
    case UPDATE_FRIENDSHIP:
      return {
        ...state,
        pendingFriends: state.pendingFriends.filter(friend => friend.id !== action.friendship.id),
        confirmedFriends: [...state.confirmedFriends, action.friendship],
      };
    case DELETE_FRIENDSHIP:
      return {
        ...state,
        pendingFriends: state.pendingFriends.filter(friend => friend.id !== action.friendshipId),
        confirmedFriends: state.confirmedFriends.filter(friend => friend.id !== action.friendshipId),
      };
    case CURRENT_USER_FRIENDSHIPS:
      return {
        ...state,
        currentUserFriendships: action.friendships,
      };
    default:
      return state;
  }
};

export default friendshipsReducer;