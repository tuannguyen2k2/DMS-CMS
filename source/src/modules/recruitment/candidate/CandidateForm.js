import { BaseForm } from '@components/common/form/BaseForm';
import FileUploadField from '@components/common/form/FileUploadField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { candidateState, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const CandidateForm = ({ isEditing, formId, actions, dataDetail, onSubmit, setIsChangedFormValues }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(candidateState, ['label']);

    const [fileList, setFileList] = useState();
    const notification = useNotification();
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
            fileCV: fileList[0]?.url,
        });
    };
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                state: stateValues[1].value,
            });
        }
    }, [isEditing]);
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setFileList([
            {
                url: dataDetail?.fileCV,
            },
        ]);
    }, [dataDetail]);
    console.log(fileList);
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);
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

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.candidateName)} name="name" required />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={translate.formatMessage(commonMessage.state)}
                            allowClear={false}
                            defaultValue={stateValues[1]}
                            options={stateValues}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.email)} name="email" required />
                    </Col>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.address)} name="address" required />
                    </Col>
                </Row>
                <Col>
                    <TextField label={translate.formatMessage(commonMessage.skill)} name="skill" required />
                </Col>
                <FileUploadField
                    showRemoveIcon={false}
                    fieldName="fileCV"
                    fileList={fileList}
                    uploadFile={uploadFile}
                    label={translate.formatMessage(commonMessage.cv)}
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default CandidateForm;
