import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkUpdateDailyLog, thunkDailyLogDetails, thunkUploadNewImage, thunkDeleteImage } from '../../redux/dailyLogs';
import './DailyLogUpdateForm.css';

const DailyLogUpdateForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dailyLogId } = useParams();
    const daily_log = useSelector(state => state.dailyLogs.dailyLogDetails[dailyLogId]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Fetch daily log details when component mounts
    useEffect(() => {
        if (dailyLogId) {
            dispatch(thunkDailyLogDetails(dailyLogId));
        }
    }, [dispatch, dailyLogId]);

    // Update form fields when daily log details are loaded
    useEffect(() => {
        if (daily_log) {
            setTitle(daily_log.title);
            setContent(daily_log.content);
            setImages(daily_log.images ? daily_log.images.map(img => ({ id: img.id, image: img.url, preview: img.preview })) : []);
        }
    }, [daily_log]);

    useEffect(() => {
        const errorArr = [];
        if (!title) errorArr.push('Title is required');
        if (title.length > 50) errorArr.push('Title cannot be more than 50 characters');
        if (!content) errorArr.push('Content is required');
        if (content.length > 2000) errorArr.push('Content cannot be more than 2000 characters');
        if (images.length < 1) errorArr.push('At least one image is required');
        if (images.length > 6) errorArr.push('Cannot upload more than 6 images');
        setErrors(errorArr);
    }, [title, content, images]);

    const handleImageChange = (index, field, value) => {
        const newImages = [...images];
        newImages[index][field] = value;

        // Ensure only one image is set as preview
        if (field === 'preview' && value === true) {
            newImages.forEach((image, i) => {
                if (i !== index) image.preview = false;
            });
        }
        setImages(newImages);
    };

    const handleAddImage = () => {
        if (images.length < 6) {
            setImages([...images, { image: '', preview: false }]);
        }
    };

    const handleRemoveImage = (index) => {
        if (images.length > 1) {
            const imageToDelete = images[index];
            if (imageToDelete.id) {
                dispatch(thunkDeleteImage(imageToDelete.id));
            }
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (errors.length > 0) {
            console.log('Form has errors:', errors);
            return;
        }
        const updatedDailyLog = { id: dailyLogId, title, content };
        const updatedDailyLogRes = await dispatch(thunkUpdateDailyLog(updatedDailyLog));

        if (updatedDailyLogRes.errors) {
            setErrors(updatedDailyLogRes.errors);
        } else {
            const uploadedImages = [];
            for (let imageObj of images) {
                if (imageObj.image && !imageObj.id) { // upload new images
                    const formData = new FormData();
                    formData.append('image', imageObj.image);
                    formData.append('preview', imageObj.preview);
                    const uploadImageRes = await dispatch(thunkUploadNewImage(daily_log.kid_id, dailyLogId, formData));
                    uploadedImages.push(uploadImageRes);
                } else {
                    uploadedImages.push(imageObj); // keep existing images
                }
            }
            updatedDailyLogRes.images = uploadedImages;
            navigate(`/dailyLogs/${updatedDailyLogRes?.id}`);
        }
    };

    return (
        <form className='daily-logs-form' onSubmit={handleSubmit} encType="multipart/form-data">
            <div id='title-box1'>
                <label htmlFor='dailyLog-title'>Title
                    {hasSubmitted && errors.includes('Title is required') && (
                        <span className='validation-errors'> Title is required</span>
                    )}
                    {hasSubmitted && errors.includes('Title cannot be more than 50 characters') && (
                        <span className='validation-errors'>Title cannot be more than 50 characters</span>
                    )}
                </label>
                <input
                    id='dailyLog-title'
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div id='content-box2'>
                <label htmlFor='dailyLog-content'>Content
                    {hasSubmitted && errors.includes('Content is required') && (
                        <span className='validation-errors'> Content is required</span>
                    )}
                    {hasSubmitted && errors.includes('Content cannot be more than 2000 characters') && (
                        <span className='validation-errors'>Content cannot be more than 2000 characters</span>
                    )}
                </label>
                <textarea
                    id='dailyLog-content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows='10'
                    cols='50'
                />
            </div>

            <div id='images-box3'>
                <label>Images</label>
                {images.map((image, index) => (
                    <div key={index} className='each-image-box'>
                        <div>
                            <input
                                type='file'
                                accept="image/*"
                                onChange={(e) => handleImageChange(index, 'image', e.target.files[0])}
                            />
                            <select
                                value={image.preview}
                                onChange={(e) => handleImageChange(index, 'preview', e.target.value === 'true')}
                            >
                                <option value={true}>Preview</option>
                                <option value={false}>Not Preview</option>
                            </select>
                        </div>
                        <div><button type='button' className='remove-add-image' onClick={() => handleRemoveImage(index)}>Remove Image</button></div>
                    </div>
                ))}
                {images.length < 6 && <button className='remove-add-image' type='button' onClick={handleAddImage}>Add Image</button>}
            </div>
            <button type='submit' id='dailyLog-submit-button'>Update your daily log</button>
        </form>
    );
};

export default DailyLogUpdateForm;





