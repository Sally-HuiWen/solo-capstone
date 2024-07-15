//action types
const GET_ALL_DAILY_LOGS = 'dailyLogs/All';
const DAILY_LOG_DETAILS = 'dailyLogs/details';
const CREATE_NEW_DAILY_LOG = 'dailyLogs/new';
const UPDATE_DAILY_LOG = 'dailyLogs/update';
const DELETE_DAILY_LOG = 'dailyLogs/delete';

const ADD_IMAGE = 'dailyLogs/:dailyLogId/images/new'
const UPDATE_IMAGE = 'dailyLogImages/:dailyLogImageId/update'
const DELETE_IMAGE = 'dailyLogImages/:dailyLogImageId/delete'

//action creators
const getAllDailyLogs = (kidId, dailyLogs) => ({
    type: GET_ALL_DAILY_LOGS,
    kidId,
    dailyLogs
});

const getDailyLogDetails = (dailyLog) => ({
    type: DAILY_LOG_DETAILS,
    dailyLog,
});

const createNewDailyLog = (dailyLog) => ({
    type: CREATE_NEW_DAILY_LOG,
    dailyLog,
});

const updateDailyLog = (dailyLog) => ({
    type: UPDATE_DAILY_LOG,
    dailyLog,
});

const deleteDailyLog = (dailyLogId) => ({
    type: DELETE_DAILY_LOG,
    dailyLogId,
});

const addNewImage = (dailyLogId, image) => ({
    type: ADD_IMAGE,
    dailyLogId,
    image,
})

const updateImage = (image) => ({
    type: UPDATE_IMAGE,
    image,
})

const deleteImage = (imageId) => ({
    type: DELETE_IMAGE,
    imageId,
})


// thunk creator
export const thunkGetAllDailyLogs = (kidId) => async (dispatch) => {
    const res = await fetch(`/api/kids/${kidId}/daily_logs`);
    if (res.ok) {
        const allDailyLogsByKidId = await res.json();
        dispatch(getAllDailyLogs(kidId, allDailyLogsByKidId.daily_logs ));
    } else {
        const error = await res.json()
        return error;
    }
};

export const thunkDailyLogDetails = (dailyLogId) => async (dispatch) => {
    const res = await fetch(`/api/daily_logs/${dailyLogId}`);
    if (res.ok) {
        const dailyLogDetails = await res.json();
        dispatch(getDailyLogDetails(dailyLogDetails));
    } else {
        const error = await res.json();
        return error;
    }
};

export const thunkCreateNewDailyLog = (kidId, dailyLog) => async (dispatch) => {
    const res = await fetch(`/api/kids/${kidId}/daily_logs/new`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dailyLog),
    });
    if (res.ok) {
        const newDailyLog = await res.json();
        dispatch(createNewDailyLog(newDailyLog));
        return newDailyLog;
    } else {
        const error = await res.json();
        return error;
    }
};

export const thunkUpdateDailyLog = (dailyLog) => async (dispatch) => {
    const res = await fetch(`/api/daily_logs/${dailyLog.id}`,{
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dailyLog),
    });
    if (res.ok) {
        const updatedDailyLog = await res.json();
        dispatch(updateDailyLog(updatedDailyLog));
        return updatedDailyLog;
    } else {
        const error = await res.json();
        return error;
    }
};

export const thunkDeleteDailyLog = (dailyLogId) => async (dispatch) => {
    const res = await fetch(`/api/daily_logs/${dailyLogId}`,{
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(deleteDailyLog(dailyLogId));
    } else {
        const error = await res.json();
        return error;
    }
};

export const thunkUploadNewImage = (dailyLogId,image) => async (dispatch) => {
    const res = await fetch(`api/daily_logs/${dailyLogId}/images/new`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(image),
    });
    if (res.ok) {
        const newImage = await res.json();
        console.log('what is the image response in thunk', newImage)
        dispatch(addNewImage(dailyLogId, newImage));
        return newImage;
    } else {
        const error = await res.json();
        return error;
    }
}

export const thunkUpdateImage = (image) => async (dispatch) => {
    const res = await fetch(`api/daily_log_images/${image.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(image),
    });
    if (res.ok) {
        const updatedImage = await res.json();
        dispatch(updateImage(updatedImage));
        return updatedImage;
    } else {
        const error = await res.json();
        return error;
    }
}

export const thunkDeleteImage = (imageId) => async (dispatch) => {
    const res = await fetch(`api/daily_log_images/${imageId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(deleteImage(imageId));
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = {
    allDailyLogs: {}, // store all daily logs by kid id
    dailyLogDetails: {}, // store details for a  daily log
    images: {} // store images by daily log id
};

export default function dailyLogReducer(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_DAILY_LOGS:
            return {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [action.kidId]: action.dailyLogs
                }
            };
        case DAILY_LOG_DETAILS:
            return {
                ...state,
                dailyLogDetails: action.dailyLog
            };
        case CREATE_NEW_DAILY_LOG:
            return {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [action.dailyLog.kid_id]: [...(state.allDailyLogs[action.dailyLog.kid_id] || []), action.dailyLog]
                }
            };
        case UPDATE_DAILY_LOG:
            return {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [action.dailyLog.kid_id]: state.allDailyLogs[action.dailyLog.kid_id].map(log => 
                        log.id === action.dailyLog.id ? action.dailyLog : log
                    )
                },
                dailyLogDetails: action.dailyLog.id === state.dailyLogDetails.id ? action.dailyLog : state.dailyLogDetails
            };
        case DELETE_DAILY_LOG:
            const newState = {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [state.dailyLogDetails.kid_id]: state.allDailyLogs[state.dailyLogDetails.kid_id]?.filter(log => log.id !== action.dailyLogId)
                },
                dailyLogDetails: state.dailyLogDetails.id === action.dailyLogId ? {} : state.dailyLogDetails
            };
            console.log("new state for delete daily log:", newState);
            return newState;
        case ADD_IMAGE:
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.dailyLogId]: [...(state.images[action.dailyLogId] || []), action.image]
                },
                dailyLogDetails: {
                    ...state.dailyLogDetails,
                    images: [...(state.dailyLogDetails.images || []), action.image]
                }
            };
        case UPDATE_IMAGE:
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.image.daily_log_id]: state.images[action.image.daily_log_id].map(img => 
                        img.id === action.image.id ? action.image : img
                    )
                },
                dailyLogDetails: {
                    ...state.dailyLogDetails,
                    images: state.dailyLogDetails.images.map(img => 
                        img.id === action.image.id ? action.image : img
                    )
                }
            };
        case DELETE_IMAGE:
            return {
                ...state,
                images: {
                    ...state.images,
                    [action.imageId]: state.images[action.imageId].filter(img => img.id !== action.imageId)
                },
                dailyLogDetails: {
                    ...state.dailyLogDetails,
                    images: state.dailyLogDetails.images.filter(img => img.id !== action.imageId)
                }
            };
        default:
            return state;
    }
}


