import { Card, Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import { documentPermissionKindOptions, formSize } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';

const DocumentGroupPermissionForm = (props) => {
    const {
        formId,
        actions,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        isEditing,
        permissions,
        size = 'small',
    } = props;
    const [group, setGroup] = useState([]);
    const translate = useTranslate();
    const [groupPermissions, setGroupPermission] = useState([]);
    const [listPermissionExisted, setListPermissionExisted] = useState([]);
    const documentPermissionKindValues = translate.formatKeys(documentPermissionKindOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const { execute: executeGetPermission } = useFetch(apiConfig.documentGroupPermission.getList, {
        immediate: false,
    });

    const handleSubmit = (values) => {
        const filterDuplicatePermission = listPermissionExisted.filter(
            (value) => !permissions?.some((obj) => value == obj.id),
        );
        
        values.documentPermissions = [...values.documentPermissions, ...filterDuplicatePermission];
        return mixinFuncs.handleSubmit({ ...values });
    };
    const transformArray = (array) => {
        let transformedArray;
        if (array) {
            transformedArray = array.reduce((result, item) => {
                const { documentPath } = item;
                if (!result[documentPath]) {
                    result[documentPath] = [];
                }

                const { id, permissionKind } = item;
                result[documentPath].push({ id, documentPath, permissionKind });
                return result;
            }, {});
        }

        return transformedArray;
    };
    const getGroupPermission = () => {
        const { permissions } = props;
        setGroup(transformArray(permissions));
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            documentPermissions: dataDetail?.documentPermissions?.map((item) => item.id),
        });
        executeGetPermission({
            params: {
                kind: 1,
                id: dataDetail.id,
            },
            onCompleted: (res) => {
                setGroupPermission(res?.data?.content[0]?.documentPermissions);
            },
        });
    }, [dataDetail]);

    useEffect(() => {
        let listPermissions = [];
        groupPermissions?.map((permission) => {
            listPermissions.push(permission.id);
        });
        setListPermissionExisted(listPermissions);
    }, [groupPermissions]);

    useEffect(() => {
        if (permissions.length !== 0) getGroupPermission();
    }, [permissions]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.name)} required name="name" />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="documentPermissions" label={translate.formatMessage(commonMessage.groupPermission)}>
                            <Checkbox.Group style={{ width: '100%', display: 'block' }} name="documentPermissions" >
                                {group
                                    ? Object.keys(group).map((groupName) => (
                                        <Card
                                            key={groupName}
                                            size="small"
                                            title={groupName}
                                            style={{ width: '100%', marginBottom: '4px' }}
                                        >
                                            <Row>
                                                {group[groupName].map((permission) => (
                                                    <Col span={8} key={permission.id}>
                                                        <Checkbox value={permission.id} checked={true}>
                                                            {documentPermissionKindValues.map((item) => {
                                                                if (item.value == permission?.permissionKind) {
                                                                    return item.label;
                                                                }
                                                            })}
                                                        </Checkbox>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                    ))
                                    : null}
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default DocumentGroupPermissionForm;
