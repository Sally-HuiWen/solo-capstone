import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkUpdateDailyLog, thunkDailyLogDetails} from '../../redux/dailyLogs';
import './DailyLogUpdateForm.css';

const DailyLogUpdateForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dailyLogId } = useParams();
    const daily_log = useSelector(state => state.dailyLogs.dailyLogDetails[dailyLogId]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [updateImage, setUpdateImage] = useState(null);
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
            setImage(daily_log.image_url);
        }
    }, [daily_log]);

    useEffect(() => {
        const errorArr = [];
        if (!title) errorArr.push('Title is required');
        if (title.length > 50) errorArr.push('Title cannot be more than 50 characters');
        if (!content) errorArr.push('Content is required');
        if (content.length > 2000) errorArr.push('Content cannot be more than 2000 characters');
        setErrors(errorArr);
    }, [title, content]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        if (updateImage) {
            formData.append('image', updateImage);
        } 
        
        if (errors?.length > 0) {
            console.log('Form has errors:', errors);
            return;
        }
        const updatedDailyLogRes = await dispatch(thunkUpdateDailyLog(dailyLogId, formData));

        if (updatedDailyLogRes?.errors) {
            setErrors(updatedDailyLogRes?.errors);
        } else {
            navigate(`/dailyLogs/${updatedDailyLogRes?.id}`);
        }
    };

    return (
        <form className='daily-logs-form' onSubmit={handleSubmit} encType="multipart/form-data">
            <div className='title-box1'>
                <label htmlFor='dailyLog-title'>Title
                    {hasSubmitted && errors?.includes('Title is required') && (
                        <span className='validation-errors'> Title is required</span>
                    )}
                    {hasSubmitted && errors?.includes('Title cannot be more than 50 characters') && (
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

            <div className='content-box2'>
                <label htmlFor='dailyLog-content'>Content
                    {hasSubmitted && errors?.includes('Content is required') && (
                        <span className='validation-errors'> Content is required</span>
                    )}
                    {hasSubmitted && errors?.includes('Content cannot be more than 2000 characters') && (
                        <span className='validation-errors'>Content cannot be more than 2000 characters</span>
                    )}
                </label>
                <textarea
                    id='dailyLog-content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>
            
            <div>
                <p>Current Image</p>
                {image && <img src={image} alt="Current Daily Log" id='current_image'/>}
            </div>
            <div className='images-box3'>
                <label htmlFor='update-image'>Update Image</label>
                <input
                    id='update_image'
                    type='file'
                    accept="image/*"
                    onChange={(e) => setUpdateImage(e.target.files[0])}
                />
            </div> 
            <div id='update-cancel-div'>
                <button type='submit'>Update</button>
                <button id='dailyLog-cancel-button'type='button' onClick={() => navigate(`/kids/${daily_log.kid_id}/dailyLogs`)}>Cancel</button>
            </div>               
            
        </form>
    );
};

export default DailyLogUpdateForm;





