import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkCreateNewDailyLog, thunkUploadNewImage } from '../../redux/dailyLogs';
import './DailyLogForm.css';

const DailyLogForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {kidId} = useParams();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([{image: '', preview: false}]);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

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

        // make sure  only one image is set as preview
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
        const newDailyLog = { title, content };
        const newDailyLogRes = await dispatch(thunkCreateNewDailyLog(kidId, newDailyLog));
        console.log('what is newDailyLog', newDailyLog)
        console.log('what is newDailyLog response from thunk', newDailyLogRes)

        if (newDailyLogRes.errors) {
            setErrors(newDailyLogRes.errors);
        } else {
            const uploadedImages = [];
            for (let imageObj of images) {
                if (imageObj.image) {
                    const formData = new FormData();
                    formData.append('image', imageObj.image);
                    formData.append('preview', imageObj.preview);
                    const uploadImageRes = await dispatch(thunkUploadNewImage(kidId, newDailyLogRes.id, formData));
                    uploadedImages.push(uploadImageRes);
                }
            }
            newDailyLogRes.images = uploadedImages;
            navigate(`/kids/${kidId}/DailyLogs`);
        }
    };

    return (
        <form className='daily-logs-form' onSubmit={handleSubmit} encType="multipart/form-data">
            <div id='title-box1'>
                <label htmlFor='dailyLog-title'>Title
                {hasSubmitted && errors.includes('Title is required') && (
                    <span className='validation-errors'> Title is required</span> 
                    )}
                    {hasSubmitted && errors.includes('Title can not be more than 50 characters') && (
                    <span className='validation-errors'>Title can not be more than 50 characters</span> 
                    )}
                </label>
                <input
                      id='dailyLog-title'
                      type='text'
                      value={title}
                      onChange={(e)=> setTitle(e.target.value)}
                    />
            </div>

            <div id='content-box2'>
                <label htmlFor='dailyLog-content'>Content
                {hasSubmitted && errors.includes('Content is required') && (
                    <span className='validation-errors'> Content is required</span> 
                    )}
                    {hasSubmitted && errors.includes('Content can not be more than 2000 characters') && (
                    <span className='validation-errors'>Content  can not be more than 2000 characters</span> 
                    )}
                </label>
                <textarea
                      id='dailyLog-content'
                      value={content}
                      onChange={(e)=> setContent(e.target.value)}
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
            <button type='submit' id='dailyLog-submit-button'>Add your new dailyLog</button>
        </form>
    );
};

export default DailyLogForm;
