export const SEND_FRIEND_REQUEST = "friendships/send_friend_request";
export const GET_PENDING_REQUESTS = "friendships/pending_requests_received";
export const GET_FRIENDS = "friendships/friends";
export const GET_FRIENDS_KID_DETAILS = "friendships/kids/details";
export const GET_FRIENDS_KIDS_DAILY_LOGS = "friendships/friends/kids/daily_logs";
export const RESPOND_REQUEST = "friendships/respond_to_requests_received";
export const DELETE_FRIEND = "friendships/delete";

export const sendFriendRequest = (friendRequest) => ({
  type: SEND_FRIEND_REQUEST,
  friendRequest,
});

export const receivePendingRequests = (pendingRequests) => ({
  type: GET_PENDING_REQUESTS,
  pendingRequests,
});

export const acceptedRequestFriends = (friends) => ({
  type: GET_FRIENDS,
  friends,
});

export const getFriendsKidDetails = (kid) => ({
  type: GET_FRIENDS_KID_DETAILS,
  kid,
});

export const getFriendsKidsDailyLogs = (kidId, dailyLogs) => ({
  type: GET_FRIENDS_KIDS_DAILY_LOGS,
  kidId,
  dailyLogs
});

export const respondToRequest = (response) => ({
  type: RESPOND_REQUEST,
  response,
});

export const deleteFriend = (friendId) => ({
  type: DELETE_FRIEND,
  friendId,
});

export const thunkSendFriendRequest = (friendId) => async (dispatch) => {
    const res = await fetch("/api/friendships/send_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friend_id: friendId }),
    });
  
    if (res.ok) {
      const friendRequest = await res.json();
      dispatch(sendFriendRequest(friendRequest));
    } else {
      const error = await res.json();
      return error;
      
    }
  };
  
export const thunkGetPendingRequests = () => async (dispatch) => {
    const res = await fetch("/api/friendships/pending_requests_received");
  
    if (res.ok) {
      const pendingRequests = await res.json();
      dispatch(receivePendingRequests(pendingRequests));
    }
  };
  
export const thunkGetFriends = () => async (dispatch) => {
    const res = await fetch("/api/friendships/friends");
  
    if (res.ok) {
      const friends = await res.json();
      dispatch(acceptedRequestFriends(friends));
      return {friends}
    }

};

export const thunkGetFriendsKidsDailyLogs = (kidId) => async (dispatch) => {
  const res = await fetch(`/api/friendships/friends/${kidId}/daily_logs`);
  if (response.ok) {
    const dailyLogs = await res.json();
    dispatch(getFriendsKidsDailyLogs(kidId, dailyLogs));
  }
};
  
export const thunkRespondToRequest = (friendId, action) => async (dispatch) => {
    const res = await fetch("/api/friend_routes/respond_to_request", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friend_id: friendId, action }),
    });
  
    if (res.ok) {
        const resMessage = await res.json();
        dispatch(respondToRequest({ friendId, action, resMessage }));
    } else {
        const error = await res.json();
        return error;
    }
};


  
export const thunkDeleteFriend = (friendId) => async (dispatch) => {
    const res = await fetch("/api/friendships/delete_friend", {
    method: "DELETE",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ friend_id: friendId }),
    })

    if (res.ok) {
        dispatch(deleteFriend(friendId));
    } else {
        const error = await res.json();
        return error;
    }
};

const initialState = {
  pendingRequests: [],
  friends: [],
  friendsKidsDailyLogs: {}
};

const friendshipsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_FRIEND_REQUEST:
      return {
        ...state,
        pendingRequests: [...state.pendingRequests, action.friendRequest],
      };
    
    case GET_PENDING_REQUESTS:
      return {
        ...state,
        pendingRequests: action.pendingRequests,
      };
    
    case GET_FRIENDS:
      return {
        ...state,
        friends: action.friends,
      };

    case GET_FRIENDS_KIDS_DAILY_LOGS:
      return {
        ...state,
        friendsKidsDailyLogs: {
          ...state.friendsKidsDailyLogs,
          [action.kidId]: action.dailyLogs,
        }
      }
    
    case RESPOND_REQUEST:
      return {
        ...state,
        pendingRequests: state.pendingRequests.filter(
          (request) => request.friend_id !== action.response.friendId
        ),
        friends:
          action.response.action === 'accept'
            ? [...state.friends, action.response.resMessage]
            : state.friends,
      };
    
    case DELETE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter((friend) => friend.id !== action.friendId),
      };
    
    default:
      return state;
  }
};

export default friendshipsReducer;