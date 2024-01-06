import axios from 'axios';

const upload = (params = {}) => {
    const {url, onUploadProgress, data, ...otherParams} = params;
    return axios({
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress,
        data,
        ...otherParams
    });
};

export default upload;