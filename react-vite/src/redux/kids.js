//action types
const CURRENT_USER_KIDS = 'kids/current';
const KID_DETAILS = 'kids/details';
const ADD_NEW_KID = 'kids/new';
const UPDATE_KID = 'kids/update';
const REMOVE_KID = 'kids/delete';

//action creators
const currentUserKids = (kids) => ({
    type: CURRENT_USER_KIDS,
    kids,
});

const getKidDetails = (kid, kidId) => ({
    type: KID_DETAILS,
    kid,
    kidId,
})

const addNewKid = (kid) => ({
    type: ADD_NEW_KID,
    kid,
})

const updateKid = (kid) => ({
    type: UPDATE_KID,
    kid,
})

const removeKid = (kidId) => ({
    type: REMOVE_KID,
    kidId,
})

//thunk creator
export const thunkGetCurrentKids = () => async (dispatch) => {
    const res = await fetch('/api/kids/current');
    if (res.ok) {
        const userKids = await res.json();
        dispatch(currentUserKids(userKids.kids))// No need to await dispatch;dispatch is a synchronous function that dispatches an action to the Redux store
    } else {
        const error = await res.json()
        return error;
    }
};

export const thunkGetKidDetails = (kidId) => async (dispatch) => {
    const res = await fetch(`/api/kids/${kidId}`);
    if (res.ok) {
        const kid = await res.json();
        dispatch(getKidDetails(kid, kidId))
    } else {
        const error = await res.json();
        return error;
    }

};

export const thunkAddNewKid = (kid) => async (dispatch) => {
    const res = await fetch('/api/kids/new', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kid)
    });
    if (res.ok) {
        const newKid = await res.json();
        dispatch(addNewKid(newKid));
        return newKid;
    } else {
        const error = await res.json(); 
        return error
    }
};

export const thunkUpdateKid = (kid) => async (dispatch) => {
    const res = await fetch(`/api/kids/${kid.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(kid),
    });
    if (res.ok) {
        const updatedKid = await res.json();
        dispatch(updateKid(updatedKid))
        return updatedKid;
    } else {
        const error = await res.json()
        return error;
    }
}

export const thunkRemoveKid = (kidId) => async (dispatch) => {
    const res = await fetch(`/api/kids/${kidId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
        dispatch(removeKid(kidId))
    } else {
        const error = await res.json()
        return error;
    }
}

//reducer
const initialState = {
    currentUserKids: [],
    kidDetails: {},
};

export default function kidReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case CURRENT_USER_KIDS:
            newState = {
                ...state,
                currentUserKids: action.kids
            };
            return newState;
        case KID_DETAILS:
            newState = {
                ...state, 
                kidDetails: {
                    ...state.kidDetails,
                    [action.kidId]: action.kid
                }
            };
            return newState;
        case ADD_NEW_KID:
            newState = {
                ...state,
                currentUserKids: [...state.currentUserKids, action.kid]
            }
            return newState;
        case UPDATE_KID: {
            const updatedKid = action.kid;
            return {
                ...state,
                currentUserKids: state.currentUserKids.map(kid =>kid.id === updatedKid.id ? updateKid : kid),
                kidDetails: updatedKid.id === state.kidDetails.id ? updatedKid : state.kidDetails,
            };
        }
        case REMOVE_KID:
            newState = {
                ...state,
                currentUserKids: state.currentUserKids.filter(kid => kid.id !== action.kidId),
                kidDetails: state.kidDetails.id === action.kidId ? {} : state.kidDetails,
            }
            return newState;
        default:
            return state;

    }
}