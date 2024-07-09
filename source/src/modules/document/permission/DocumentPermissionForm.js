import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import apiConfig from '@constants/apiConfig';
import { documentPermissionKindOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Card, Checkbox, Col, Form, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
    confirmUpdateChildrenDocumentPermission: 'Do you want to apply permissions to subdocuments inside this folder?',
});

const DocumentPermissionForm = (props) => {
    const queryParameters = new URLSearchParams(window.location.search);
    const path = queryParameters.get('path');
    const translate = useTranslate();
    const [groupPermissions, setGroupPermission] = useState([]);
    const [childrenPermissions, setChildrenPermissions] = useState([]);
    const [listPermissionExisted, setListPermissionExisted] = useState([]);
    const {
        formId,
        actions,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        permissions,
        isEditing,
        isSubmitting,
        showCloseFormConfirm,
        isChanged,
    } = props;
    const documentPermissionKindValues = translate.formatKeys(documentPermissionKindOptions, ['label']);
    const { execute: executeGetPermission } = useFetch(apiConfig.documentGroupPermission.getList, {
        immediate: false,
    });
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const filterDuplicatePermission = (values) => {
        let filterDuplicatePermission;
        let childrenPermissionsHasParentPermissionKinds = [];
        if (childrenPermissions?.length > 0) {
            const filteredData = permissions.filter((item) => values?.documentPermissions?.includes(item.id));

            // Lấy mảng permissionKind của parent tương ứng
            const permissionKinds = filteredData.map((item) => item?.permissionKind);
            childrenPermissionsHasParentPermissionKinds = childrenPermissions
                .filter((item) => permissionKinds.includes(item?.permissionKind))
                .map((item) => item.id);
            filterDuplicatePermission = listPermissionExisted.filter(
                (value) => !permissions?.some((obj) => value == obj.id),
            );
        } else {
            filterDuplicatePermission = listPermissionExisted.filter(
                (value) => !permissions?.filter((item) => item?.documentPath == path)?.some((obj) => value == obj.id),
            );
        }
        return [...childrenPermissionsHasParentPermissionKinds, ...filterDuplicatePermission];
    };
    const handleSubmit = (values) => {
        values.documentPermissions = [...values.documentPermissions, ...filterDuplicatePermission(values)];
        console.log(groupPermissions);
        console.log(values.documentPermissions);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        setIsChangedFormValues(true);
        form.setFieldsValue({
            ...dataDetail,
            documentPermissions: dataDetail?.documentPermissions
                ?.filter((item) => item?.documentPath == path)
                ?.map((item) => item.id),
        });
        if (dataDetail?.id) {
            executeGetPermission({
                params: {
                    kind: 1,
                    id: dataDetail.id,
                },
                onCompleted: (res) => {
                    setGroupPermission(res?.data?.content[0]?.documentPermissions);
                },
            });
        }
    }, [dataDetail]);

    useEffect(() => {
        let listPermissions = [];
        groupPermissions?.map((permission) => {
            listPermissions.push(permission.id);
        });
        setListPermissionExisted(listPermissions);
    }, [groupPermissions]);

    const options = permissions
        ?.filter((item) => item?.documentPath == path)
        .map((item) => ({
            label: documentPermissionKindValues.map((option) => {
                if (item.permissionKind == option.value) {
                    return option.label;
                }
            }),
            value: item.id,
        }));
    const handleOnClickSubmit = () => {
        console.log(dataDetail?.kind);
        if (path.endsWith('/')) {
            Modal.confirm({
                title: translate.formatMessage(messages.confirmUpdateChildrenDocumentPermission),
                centered: true,
                okText: translate.formatMessage(commonMessage.yes),
                okType: 'danger',
                cancelText: translate.formatMessage(commonMessage.no),
                onOk: () => {
                    setChildrenPermissions(
                        permissions
                            ?.filter((item) => item?.documentPath != path)
                            ?.map((item) => ({ id: item?.id, permissionKind: item?.permissionKind })),
                    );
                    form.submit();
                },
                onCancel: () => {
                    form.submit();
                },
            });
        } else {
            form.submit();
        }
    };

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.groupPermissionName)}
                            name="name"
                            disabled
                        />
                    </Col>
                </Row>
                <Col span={22}>
                    <Form.Item
                        name="documentPermissions"
                        label={translate.formatMessage(commonMessage.documentPermission)}
                    >
                        <Checkbox.Group
                            options={options}
                            name="documentPermissions"
                            onChange={(value) => {
                                setIsChangedFormValues(true);
                            }}
                        />
                    </Form.Item>
                </Col>
                <div className="footer-card-form">
                    {' '}
                    <Row justify="end" gutter={12}>
                        <Col>
                            <Button
                                danger
                                key="cancel"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showCloseFormConfirm();
                                }}
                                icon={<StopOutlined />}
                            >
                                {translate.formatMessage(commonMessage.cancel)}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                disabled={!isChanged}
                                type="primary"
                                form={formId}
                                loading={isSubmitting}
                                icon={<SaveOutlined />}
                                onClick={handleOnClickSubmit}
                            >
                                {isEditing
                                    ? translate.formatMessage(commonMessage.update)
                                    : translate.formatMessage(commonMessage.create)}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>
        </BaseForm>
    );
};

export default DocumentPermissionForm;
