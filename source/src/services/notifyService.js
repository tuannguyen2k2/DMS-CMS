import { notification } from 'antd';

const showSuccessMessage = (message, content) => {
    notification.success({
        message: message,
        description: content,
    });
};

const showErrorMessage = (message, content) => {
    notification.error({
        message: message,
        description: content,
    });
};

const showWarningMessage = (message, content) => {
    notification.warning({
        message: message,
        description: content,
    });
};

export { showErrorMessage, showWarningMessage, showSuccessMessage };
