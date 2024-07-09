import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React, { useEffect, useState } from 'react';
import DocumentUploadFileForm from './DocumentUploadFileForm';
import { useLocation } from 'react-router-dom';
import routes from '@routes';
import useFetch from '@hooks/useFetch';
import useAuth from '@hooks/useAuth';

const DocumentUploadFileSavePage = ({ pageOptions }) => {
    const { profile } = useAuth();
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const path = queryParameters.get('path');
    const [justRead, setJustRead] = useState(false);
    const [noAccessPage, setNoAccessPage] = useState(false);
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.document.getById,
            create: apiConfig.document.create,
            update: apiConfig.document.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    documentPath: detail.documentPath,
                    id: detail.id,
                    kind: 2,
                    fileUrl: detail.fileUrl,
                    fileName: detail.fileName,
                    status: detail.status,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: 2,
                    documentPath: path ? path : '/',
                };
            };
        },
    });
    const {
        data: permissions,
        execute: executeGetPermission,
        loading: loadingGetPermission,
    } = useFetch(apiConfig.documentPermission.getByDoc, {
        immediate: false,
        mappingData: ({ data }) => data,
    });
    useEffect(() => {
        if (detail?.id) {
            executeGetPermission({ pathParams: { id: detail?.id } });
        }
    }, [detail]);
    useEffect(() => {
        if (permissions) {
            const hasPermissionRead = permissions.some((permission) => permission.permissionKind == '1');
            const hasPermissionWrite = permissions.some((permission) => permission.permissionKind == '2');
            if (hasPermissionRead && !hasPermissionWrite) {
                setJustRead(true);
            } else if (!hasPermissionRead && !hasPermissionWrite) {
                setNoAccessPage(true);
            }
        }
        if (permissions === undefined) {
            setNoAccessPage(true);
        }
    }, [permissions]);
    const breadCrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.document),
            path: routes.documentManageListPage.path,
        },
    ];
    const filterPathBreadCrumb = (keyword) => {
        const keywordIndex = path.indexOf(keyword);
        return path.substring(0, keywordIndex + keyword.length);
    };
    const titleBreadCrumbsArray = path?.split('/')?.filter((word) => word.length > 0);
    path &&
        titleBreadCrumbsArray.map((title) => {
            breadCrumbs.push({
                breadcrumbName: title,
                path: routes.documentManageListPage.path + `?path=${filterPathBreadCrumb(title)}/`,
            });
        });
    (permissions !== null || !isEditing || profile?.kind == 1) &&
        breadCrumbs.push({ breadcrumbName: justRead ? translate.formatMessage(commonMessage.viewFile) : title });

    return (
        <PageWrapper
            loading={loading}
            routes={!noAccessPage ? (path ? breadCrumbs : pageOptions.renderBreadcrumbs(commonMessage, translate, title)): []}
        >
            {(permissions !== null || !isEditing || profile?.kind == 1) && (
                <DocumentUploadFileForm
                    setIsChangedFormValues={setIsChangedFormValues}
                    dataDetail={detail ? detail : {}}
                    formId={mixinFuncs.getFormId()}
                    isEditing={isEditing}
                    actions={mixinFuncs.renderActions()}
                    onSubmit={onSave}
                    permissions={permissions}
                    justRead={justRead}
                    noAccessPage={noAccessPage}
                />
            )}
        </PageWrapper>
    );
};

export default DocumentUploadFileSavePage;
