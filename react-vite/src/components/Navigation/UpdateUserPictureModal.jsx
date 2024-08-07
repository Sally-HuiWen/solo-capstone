import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkUploadProfileImage, thunkUpdateProfileImage, thunkDeleteProfileImage } from "../../redux/session"; 
import './UpdateUserPictureModal.css';

export default function UpdateUserPictureModal({ user }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errorArr = [];
        if (!image && !user?.user_image_url) errorArr.push('Image is required');
        setErrors(errorArr);
    }, [image, user?.user_image_url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (errors.length > 0) {
            console.log('Form has errors:', errors);
            return;
        }

        if (user?.user_image_url) {
            const updatedImage = await dispatch(thunkUpdateProfileImage(image));
            if (updatedImage?.errors) {
                setErrors(updatedImage.errors);
            } else {
                closeModal();
            }
        } else {
            const newImage = await dispatch(thunkUploadProfileImage(image));
            if (newImage?.errors) {
                setErrors(newImage.errors);
            } else {
                closeModal();
            }
        }
    };

    const handleDelete = async () => {
        const result = await dispatch(thunkDeleteProfileImage());
        console.log('what is handleDelete result', result)
        if (result?.errors) {
            setErrors(result.errors);
        } else {
            closeModal();
        }
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <form className='update-profile-picture-form' onSubmit={handleSubmit} encType="multipart/form-data">
            {user?.user_image_url ? (
                <>
                    <h2 className='modal-title'>Update Or Delete Your Profile Picture</h2>
                    <div id='current-profile-picture'>
                        <img src={user.user_image_url} alt="Current Profile Picture" className='profile-image' />
                        <button type='button' id='profile-picture-delete-button' onClick={handleDelete}>Delete</button>
                    </div>
                    <div id='upload-profile-picture-div'>
                        <label htmlFor='profile-picture'>Profile Picture Upload
                            {hasSubmitted && errors?.includes('Image is required') && (
                                <span className='validation-errors'> Image is required</span>
                            )}
                        </label>
                        <input
                            id='profile-picture'
                            type='file'
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className='update-and-cancel-box'>
                        <button type='submit' id='profile-picture-submit-button'>Update</button>
                        <button type='button' id='profile-picture-cancel-button' onClick={handleCancel}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className='modal-title'>Add Your Profile Picture</h2>
                    <div id='upload-profile-picture-div'>
                        <label htmlFor='profile-picture'>Profile Picture Upload
                            {hasSubmitted && errors?.includes('Image is required') && (
                                <span className='validation-errors'> Image is required</span>
                            )}
                        </label>
                        <input
                            id='profile-picture'
                            type='file'
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className='submit-and-cancel-box'>
                        <button type='submit' id='profile-picture-submit-button'>Submit</button>
                        <button type='button' id='profile-picture-cancel-button' onClick={handleCancel}>Cancel</button>
                    </div>
                </>
            )}
        </form>
    );
}