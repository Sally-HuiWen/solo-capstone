//action types
export const GET_COMMENTS = 'comments/get_comments';
export const LEAVE_COMMENT = 'comments/leave_comment';
export const UPDATE_COMMENT = 'comments/update_comment';
export const DELETE_COMMENT = 'comments/delete_comment';

// action creators
export const getComments = (dailyLogId, comments) => ({
    type: GET_COMMENTS,
    dailyLogId,
    comments,
});

export const leaveComment = (comment) => ({
    type: LEAVE_COMMENT,
    dailyLogId: comment.daily_log_id, 
    comment,
});

export const updateComment = (comment) => ({
    type: UPDATE_COMMENT,
    dailyLogId: comment.daily_log_id, 
    comment,
});

export const deleteComment = (commentId) => ({
    type: DELETE_COMMENT,
    dailyLogId,
    commentId,
});

// thunk creators
export const thunkGetComments = (dailyLogId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${dailyLogId}/comments`);
    if (res.ok) {
        const comments = await res.json();
        console.log('what is thunkGetComments comments', comments); 
        dispatch(getComments(dailyLogId, comments));
    } else {
        const error = await res.json()
        return error;
    }
};

export const thunkLeaveComment = (dailyLogId, content) => async (dispatch) => {
    const res = await fetch(`/api/comments/${dailyLogId}/new-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: content }),
    });
    if (res.ok) {
        const newComment = await res.json();
        dispatch(leaveComment(newComment));
        return newComment;
    } else {
        const error = await res.json()
        return error;
    }
};

export const thunkUpdateComment = (commentId, content) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: content }),
    });

    if (res.ok) {
        const updatedComment = await res.json();
        dispatch(updateComment(updatedComment));
        return updateComment;
    } else {
        const error = await res.json()
        return error;
    }
};

export const thunkDeleteComment = (commentId, dailyLogId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        dispatch(deleteComment(commentId, dailyLogId));
    } else {
        const error = await res.json()
        return error;
    }
};

const initialState = {};

// Reducer
const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_COMMENTS: 
            return {
                ...state,
                [action.dailyLogId]: action.comments,
            };
        case LEAVE_COMMENT:
            return {
                ...state,
                [action.dailyLogId]: [
                    action.comment,  // make sure the new comment is at the top
                    ...(state[action.dailyLogId] || []),
                ],
            };
        case UPDATE_COMMENT: {
            const updatedComments = state[action.dailyLogId].map(comment => 
                comment.id === action.comment.id ? action.comment : comment
            );
            return {
                ...state,
                [action.dailyLogId]: updatedComments,
            };
        }
        case DELETE_COMMENT: {
            const filteredComments = state[action.dailyLogId].filter(
                comment => comment.id !== action.commentId
            );
            return {
                ...state,
                [action.dailyLogId]: filteredComments,
            };
        }
        default:
            return state;
    }
};

export default commentsReducer;