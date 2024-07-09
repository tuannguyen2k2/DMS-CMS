import { BaseForm } from '@components/common/form/BaseForm';
import InputTagField from '@components/common/form/InputTagField';
import TextField from '@components/common/form/TextField';
import NoAccessPage from '@components/common/page/unPermission/NoAccessPage';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const DocumentManageForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, permissions, justRead, noAccessPage } =
        props;
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const { data: tags } = useFetch(apiConfig.document.getTags, {
        immediate: true,
        mappingData: ({ data }) => data.tags.map((item) => ({ value: item })),
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
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
                    <Col span={22}>
                        <TextField
                            disabled={justRead}
                            label={translate.formatMessage(commonMessage.folderName)}
                            name="fileName"
                            required
                        />
                    </Col>

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

export default DocumentManageForm;
