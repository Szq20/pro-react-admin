import axios from 'axios';
import {showError} from '@utils';

const download = async function (param = {}) {
    if (typeof param === 'string') {
        window.open(param);
        return;
    }

    // 处理blob下载
    const {url, ...otherParam} = param;
    await axios({
        url,
        method: 'post',
        data: otherParam,
        withCredentials: true,
        responseType: 'blob'
    }).then(response => {
        console.log(response, 'response');
        return response;
    }).then(res => {

        const {data: blob, headers: {'content-disposition': contentDisposition}} = res;
        const fileName = decodeURIComponent(contentDisposition.split('=')[1], 'UTF-8');
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
            return;
        }
        const selfURL = window.URL || window.webkitURL;
        url && selfURL.revokeObjectURL(url);
        const toBlobUrl = selfURL.createObjectURL(blob);
        const aEl = document.createElement('a');
        aEl.href = toBlobUrl;
        aEl.download = fileName;
        aEl.click();
    }).catch(error => {
        showError(`${url} 下载失败 ${error}`);
    });
};

export default download;