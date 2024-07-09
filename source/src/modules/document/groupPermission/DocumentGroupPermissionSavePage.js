import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE, UserTypes } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import routes from '@routes';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentGroupPermissionForm from './DocumentGroupPermissionForm';
import { commonMessage } from '@locales/intl';
import useTranslate from '@hooks/useTranslate';
import { showErrorMessage } from '@services/notifyService';

const DocumentGroupPermissionSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const [permissions, setPermissions] = useState([]);
    const { execute: executeGetPermission } = useFetch(apiConfig.documentPermission.getList, {
        immediate: false,
    });

    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.documentGroupPermission.getById,
            create: apiConfig.documentGroupPermission.create,
            update: apiConfig.documentGroupPermission.update,
        },
        options: {
            getListUrl: routes.documentGroupPermissionListPage.path,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    id: detail.id,
                    status: 1,
                    kind: UserTypes.ADMIN,
                    ...data,
                    documentPermissions: data?.documentPermissions ? data?.documentPermissions : [],
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: UserTypes.ADMIN,
                    documentPermissions: data?.documentPermissions ? data?.documentPermissions : [],
                };
            };
            funcs.mappingData = (response) => {
                if (response.result === true)
                    return {
                        ...response.data,
                        permissions: response.data?.permissions
                            ? response.data?.permissions.map((permission) => permission.id)
                            : [],
                    };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-DOC-GROUP-0000') {
                    showErrorMessage(translate.formatMessage(commonMessage.error),translate.formatMessage(commonMessage.existPermissionGroup));
                } else if (err.code === 'ERROR-DOC-GROUP-0001') {
                    showErrorMessage(translate.formatMessage(commonMessage.error),translate.formatMessage(commonMessage.existPermissionGroup));
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                }
                mixinFuncs.setSubmit(false);
            };
        },
    });

    useEffect(() => {
        executeGetPermission({
            params: {
                size: 1000,
                isRoot: true,
            },
            onCompleted: (res) => {
                setPermissions(res?.data?.content);
            },
        });
    }, []);

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <DocumentGroupPermissionForm
                size="normal"
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                permissions={permissions || []}
            />
        </PageWrapper>
    );
};

export default DocumentGroupPermissionSavePage;
