import { BaseForm } from '@components/common/form/BaseForm';
import FileDownloadField from '@components/common/form/FileDownloadField';
import FileUploadField from '@components/common/form/FileUploadField';
import InputTagField from '@components/common/form/InputTagField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import NoAccessPage from '@components/common/page/unPermission/NoAccessPage';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import { documentKindOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { AutoComplete, Card, Col, Form, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { CiLight } from 'react-icons/ci';

const DocumentUploadFileForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing, justRead, noAccessPage } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [fileList, setFileList] = useState();
    // const [permissions, setPermissions] = useState()
    const notification = useNotification();

    const { form, mixinFuncs, onValuesChange, setFieldValue, getFieldValue } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const { data: tags } = useFetch(apiConfig.document.getTags, {
        immediate: true,
        mappingData: ({ data }) => data.tags.map((item) => ({ value: item })),
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            fileUrl: !isEditing && fileList[0]?.url,
            fileName: !isEditing && fileList[0]?.name,
        });
    };
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'DOCUMENT',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    setFileList([
                        {
                            uid: file.uid,
                            name: file.name,
                            status: 'done',
                            url: response.data.filePath,
                        },
                    ]);
                    setIsChangedFormValues(true);
                    onSuccess();
                }
            },
            onError: (error) => {
                notification({ type: 'error', message: error?.message });
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <BaseForm
            id={formId}
            onFinish={handleSubmit}
            form={form}
            onValuesChange={onValuesChange}
            size={noAccessPage ? '100%' : 'small'}
        >
            {!noAccessPage ? (
                <Card className="card-form" bordered={false}>
                    <Row gutter={16}>
                        <Col span={12}>
                            {isEditing ? (
                                <FileDownloadField
                                    fileUrl={dataDetail?.fileUrl}
                                    fileName={dataDetail?.fileName}
                                    label={translate.formatMessage(commonMessage.file)}
                                />
                            ) : (
                                <FileUploadField
                                    showRemoveIcon={false}
                                    required
                                    fieldName="fileUrl"
                                    fileList={fileList}
                                    uploadFile={uploadFile}
                                    label={translate.formatMessage(commonMessage.file)}
                                />
                            )}
                        </Col>
                    </Row>
                    <Col span={22}>
                        <InputTagField
                            disabled={justRead}
                            options={tags}
                            name="tags"
                            label={translate.formatMessage(commonMessage.tag)}
                            setIsChangedFormValues={setIsChangedFormValues}
                            form={form}
                        />
                    </Col>
                    <Col span={22}>
                        <TextField
                            disabled={justRead}
                            label={translate.formatMessage(commonMessage.description)}
                            type="textarea"
                            name="description"
                        />
                    </Col>
                    {!justRead && <div className="footer-card-form">{actions}</div>}
                </Card>
            ) : (
                <NoAccessPage />
            )}
        </BaseForm>
    );
};

export default DocumentUploadFileForm;
