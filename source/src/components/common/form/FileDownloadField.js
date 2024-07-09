import { Button, Form, Upload } from 'antd';
import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import useFormField from '@hooks/useFormField';
import apiConfig from '@constants/apiConfig';
import { generatePath, useNavigate } from 'react-router-dom';
import { AppConstants } from '@constants';

const FileDownloadField = (props) => {
    const { label, disabled, fieldName, fileUrl, data, fileName } = props;

    const { rules } = useFormField(props);

    return (
        <Form.Item label={label} name={fieldName} rules={rules}>
            <a target="_blank" rel="noreferrer" href={!disabled && AppConstants.contentRootUrl + fileUrl}>
                <Button icon={<DownloadOutlined />} disabled={disabled}></Button>
            </a>
            <span style={{ paddingLeft: '10px' }}>{fileName}</span>
        </Form.Item>
    );
};

export default FileDownloadField;
