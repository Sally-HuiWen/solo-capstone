const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const UPLOAD_USER_IMAGE = 'session/uploadUserImage';
const UPDATE_USER_IMAGE = 'session/updateUserImage';
const DELETE_USER_IMAGE = 'session/deleteUserImage';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

const uploadUserImage = (imageUrl) => ({
  type: UPLOAD_USER_IMAGE,
  imageUrl,
});

const updateUserImage = (imageUrl) => ({
  type: UPDATE_USER_IMAGE,
  imageUrl
});

const deleteUserImage = () => ({
  type: DELETE_USER_IMAGE,
});


export const thunkAuthenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkUploadProfileImage = (image) => async (dispatch) => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await fetch('/api/users/upload-profile-picture', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(uploadUserImage(data.user_image_url));
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return errorMessages;
    } else {
      return { server: "Something went wrong. Please try again" };
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
  }
};

export const thunkUpdateProfileImage = (image) => async (dispatch) => {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await fetch('/api/users/update-profile-picture', {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateUserImage(data.user_image_url));
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return errorMessages;
    } else {
      return { server: "Something went wrong. Please try again" };
    }
  } catch (error) {
    console.error('Error updating profile image:', error);
  }
};

export const thunkDeleteProfileImage = () => async (dispatch) => {
    const response = await fetch('/api/users/delete-profile-picture', {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteUserImage());
      return null;
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return errorMessages;
    } else {
      return { server: "Something went wrong. Please try again" };
    }
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case UPLOAD_USER_IMAGE:
      return { ...state, user: { ...state.user, user_image_url: action.imageUrl}};
    case UPDATE_USER_IMAGE:
      return { ...state, user: { ...state.user, user_image_url: action.imageUrl}};
    case DELETE_USER_IMAGE:
      return { ...state, user: { ...state.user, user_image_url: null }};
    default:
      return state;
  }
}

export default sessionReducer;
