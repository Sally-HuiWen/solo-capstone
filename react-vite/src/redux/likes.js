const GET_LIKES = 'likes/get_likes';
const CLICK_LIKE = 'likes/click_like';
const REMOVE_LIKE = 'likes/remove_like';

const getLikes = (likes) => ({
  type: GET_LIKES,
  likes,
});

const addLike = (like) => ({
  type: CLICK_LIKE,
  like,
});

const removeLike = (likeId) => ({
  type: REMOVE_LIKE,
  likeId,
});

export const thunkGetLikes = (dailyLogId) => async (dispatch) => {
  const res = await fetch(`/api/likes/${dailyLogId}/usernames`);
  if (res.ok) {
    const likes = await res.json();
    dispatch(getLikes(likes));
  }
};

export const thunkClickLike = (dailyLogId) => async (dispatch) => {
  const res = await fetch(`/api/likes/${dailyLogId}`, {
    method: 'POST',
  });
  if (res.ok) {
    const like = await res.json();
    dispatch(addLike(like));
  }
};

export const thunkRemoveLike = (dailyLogId) => async (dispatch) => {
  const res = await fetch(`/api/likes/${dailyLogId}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    dispatch(removeLike(dailyLogId));
  }
};


const initialState = {};

export default function likesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_LIKES:
      return { ...state, ...action.likes };
    case CLICK_LIKE:
      return { ...state, [action.like.daily_log_id]: action.like };
    case REMOVE_LIKE: {
      const newState = { ...state };
      delete newState[action.likeId];
      return newState;
    }
    default:
      return state;
  }
}

