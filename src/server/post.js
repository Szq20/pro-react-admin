import request from './request';
import {generatePath} from 'react-router-dom';


function post(url, params = {}, cancelToken, options) {
    let resUrl = url;
    try {
        // eg:
        // const path = generatePath('/user/:id', {id: 123});
        // // console.log(path); // 输出: "/user/123"
        resUrl = decodeURIComponent(generatePath(url, params));
    } catch (e) {
        // console.log('e', e);
    }

    // console.log(resUrl, 'resUrl');
    // request.defaults.baseURL = window.DOCUMENT_CENTER_APIURL;
    return request({
        url: resUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: params,
        cancelToken,
        ...options
    });
}

export default post;