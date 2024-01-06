import tryCatch from './tryCatch';
import sentryInit from './sentry';
import {message} from 'antd';

const showSuccess = msg => {

    message.success({
        type: 'success',
        content: msg,
        duration: 5
    });
};

const showError = msg => {
    console.log(msg, 'msg');
    message.error({
        type: 'error',
        content: msg,
        duration: 5
    });
};
const showWarning = msg => {
    message.warning({
        type: 'warning',
        content: msg,
        duration: 5
    });
};

export {
    showSuccess,
    showError,
    showWarning,
    tryCatch, sentryInit
};

