//action types
const GET_ALL_DAILY_LOGS = 'dailyLogs/All';
const DAILY_LOG_DETAILS = 'dailyLogs/details';
const CREATE_NEW_DAILY_LOG = 'dailyLogs/new';
const UPDATE_DAILY_LOG = 'dailyLogs/update';
const DELETE_DAILY_LOG = 'dailyLogs/delete';

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

const deleteDailyLog = (kidId, dailyLogId) => ({
    type: DELETE_DAILY_LOG,
    kidId,
    dailyLogId,
});


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

export const thunkCreateNewDailyLog = (kidId, formData) => async (dispatch) => {
    const res = await fetch(`/api/kids/${kidId}/daily_logs/new`,{
        method: 'POST',
        body: formData
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

export const thunkUpdateDailyLog = (dailyLogId, formData) => async (dispatch) => {
    const res = await fetch(`/api/daily_logs/${dailyLogId}`,{
        method: 'PUT',
        body: formData
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

export const thunkDeleteDailyLog = (kidId, dailyLogId) => async (dispatch) => {
    const res = await fetch(`/api/daily_logs/${dailyLogId}`,{
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(deleteDailyLog(kidId, dailyLogId));
    } else {
        const error = await res.json();
        return error;
    }
};

const initialState = {
    allDailyLogs: {}, // store all daily logs by kid id
    dailyLogDetails: {}, // store details for a  daily log
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
                dailyLogDetails: {
                    ...state.dailyLogDetails,
                    [action.dailyLog.id]: action.dailyLog,
                },
            };
        case CREATE_NEW_DAILY_LOG:
            return {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [action.dailyLog.kid_id]: [...(state.allDailyLogs[action.dailyLog.kid_id] || []), action.dailyLog],
                },
                dailyLogDetails: {
                    ...state.dailyLogDetails,
                    [action.dailyLog.id]: action.dailyLog,
                },
            };
        case UPDATE_DAILY_LOG:
            return {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [action.dailyLog.kid_id]: state.allDailyLogs[action.dailyLog.kid_id]?.map(log => 
                        log.id === action.dailyLog.id ? action.dailyLog : log
                    )
                },
                dailyLogDetails: action.dailyLog.id === state.dailyLogDetails.id ? action.dailyLog : state.dailyLogDetails
            };
        case DELETE_DAILY_LOG: {
            const newState = {
                ...state,
                allDailyLogs: {
                    ...state.allDailyLogs,
                    [action.kidId]: state.allDailyLogs[action.kidId]?.filter(log => log.id !== action.dailyLogId)
                    // [state.dailyLogDetails.kid_id]: state.allDailyLogs[state.dailyLogDetails.kid_id]?.filter(log => log.id !== action.dailyLogId)
                },
                dailyLogDetails: state.dailyLogDetails.id === action.dailyLogId ? {} : state.dailyLogDetails
            };
            console.log("new state for delete daily log:", newState);
            return newState;
        }
        default:
            return state;
    }
}


