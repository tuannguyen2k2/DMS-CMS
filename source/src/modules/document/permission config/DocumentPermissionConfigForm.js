import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

const DocumentPermissionConfigForm = (props) => {
    const translate = useTranslate();
    const activeTab = localStorage.getItem('activePermissionConfigTab')
        ? localStorage.getItem('activePermissionConfigTab')
        : 'group';
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues } = props;

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
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
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        {activeTab == 'user' ? (
                            <AutoCompleteField
                                required
                                label={translate.formatMessage(commonMessage.account)}
                                name="userId"
                                apiConfig={apiConfig.user.autocomplete}
                                maxOptions={5}
                                mappingOptions={(item) => ({ value: item.id, label: item.fullName })}
                                searchParams={(text) => ({ name: text })}
                            />
                        ) : (
                            <AutoCompleteField
                                required
                                label={translate.formatMessage(commonMessage.userGroup)}
                                name="groupId"
                                maxOptions={5}
                                apiConfig={apiConfig.groupPermission.autocomplete}
                                mappingOptions={(item) => ({ value: item.id, label: item.name })}
                                searchParams={(text) => ({ name: text })}
                                initialSearchParams={{ kind: 3 }}
                            />
                        )}
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            required
                            label={translate.formatMessage(commonMessage.folderPermissionGroup)}
                            name="documentGroupId"
                            apiConfig={apiConfig.documentGroupPermission.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            initialSearchParams={{ kind: 1 }}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DocumentPermissionConfigForm;
