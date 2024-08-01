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

const removeLike = (like) => ({
  type: REMOVE_LIKE,
  like,
});

export const thunkGetLikes = (dailyLogId) => async (dispatch) => {
  const res = await fetch(`/api/likes/${dailyLogId}`);
  if (res.ok) {
    const likes = await res.json();
    console.log('what are likes in thunk', likes)
    dispatch(getLikes(likes));
  }
};

export const thunkClickLike = (dailyLogId) => async (dispatch) => {
  const res = await fetch(`/api/likes/${dailyLogId}/like`, {
    method: 'POST',
  });
  if (res.ok) {
    const like = await res.json();
    console.log('what is new like in thunk', like)
    dispatch(addLike(like));
    dispatch(thunkGetLikes(dailyLogId));
  }
};

export const thunkRemoveLike = (dailyLogId) => async (dispatch) => {
  const res = await fetch(`/api/likes/${dailyLogId}/unlike`, {
    method: 'DELETE',
  });
  if (res.ok) {
    const like = await res.json();
    console.log('what is unlike in thunk', like)
    dispatch(removeLike(like));
    dispatch(thunkGetLikes(dailyLogId));
  }
};

const initialState = {};
export default function likesReducer(state = initialState, action) {
  switch (action.type) {
      case GET_LIKES: {
          const newLikes = {};
          action.likes.forEach((like) => {
              newLikes[like.daily_log_id] = newLikes[like.daily_log_id] || [];
              newLikes[like.daily_log_id].push(like);
          });
          return {
              ...state,
              ...newLikes,
          };
      }
      case CLICK_LIKE: {
          const { daily_log_id } = action.like;
          return {
              ...state,
              [daily_log_id]: [...(state[daily_log_id] || []), action.like],
          };
      }
      case REMOVE_LIKE: {
          const { daily_log_id, id } = action.like;
          return {
              ...state,
              [daily_log_id]: state[daily_log_id]?.filter((like) => like.id !== id),
          };
      }
      default:
          return state;
  }
}

// export default function likesReducer(state = initialState, action) {
//   switch (action.type) {
//     case GET_LIKES:
//       return { ...state, ...action.likes };
//     case CLICK_LIKE:
//       return { ...state, [action.like.daily_log_id]: action.like };
//     case REMOVE_LIKE: {
//       const newState = { ...state };
//       delete newState[action.likeId];
//       return newState;
//     }
//     default:
//       return state;
//   }
// }

