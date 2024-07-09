import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React, { useEffect, useState } from 'react';
import DocumentPermissionForm from './DocumentPermissionForm';
import useFetch from '@hooks/useFetch';
import routes from '@routes';

const DocumentPermissionSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const [permissions, setPermissions] = useState([]);
    const queryParameters = new URLSearchParams(window.location.search);
    const path = queryParameters.get('path');
    const { execute: executeGetPermission } = useFetch(apiConfig.documentPermission.getList, {
        immediate: false,
    });
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title,isSubmitting,isChanged } = useSaveBase({
        apiConfig: {
            getById: apiConfig.documentGroupPermission.getById,
            create: apiConfig.documentGroupPermission.create,
            update: apiConfig.documentGroupPermission.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                    kind: 1,
                };
            };
        },
    });
    useEffect(() => {
        executeGetPermission({
            params: {
                size: 1000,
                path: path,
            },
            onCompleted: (res) => {
                setPermissions(res?.data?.content);
            },
        });
    }, []);
    const filterPathBreadCrumbs = (path) => {
        const lastSlashIndex = path.lastIndexOf('/');
        const secondLastSlashIndex = path.lastIndexOf('/', lastSlashIndex - 1);
        return path.slice(0, secondLastSlashIndex + 1);
    };
    const breadCrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.document),
            path: routes.documentManageListPage.path + `?path=${filterPathBreadCrumbs(path)}`,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.documentPermission),
            path: routes.documentPermissionListPage.path + `?path=${path}`,
        },
        { title },
    ];

    return (
        <PageWrapper loading={loading} routes={breadCrumbs}>
            <DocumentPermissionForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                id={detail?.id}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                permissions={permissions || []}
                isSubmitting={isSubmitting}
                showCloseFormConfirm={mixinFuncs.showCloseFormConfirm}
                isChanged={isChanged}
            />
        </PageWrapper>
    );
};

export default DocumentPermissionSavePage;
