import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import DocumentPermissionListPage from './permission';
import DocumentPermissionSavePage from './permission/DocumentPermissionSavePage';
import DocumentManageListPage from './documentManage';
import DocumentUploadFileSavePage from './documentManage/DocumentUploadFileSavePage';
import DocumentManageSavePage from './documentManage/DocumentManageSavePage';
import DocumentGroupPermissionListPage from './groupPermission';
import DocumentGroupPermissionSavePage from './groupPermission/DocumentGroupPermissionSavePage';
import DocumentSearchListPage from './search';
import DocumentPermissionConfigListPage from './permission config';
import DocumentPermissionConfigSavePage from './permission config/DocumentPermissionConfigSavePage';
const paths = {
    documentPermissionListPage: '/document/document-permission',
    documentPermissionSavePage: '/document/document-permission/:id',
    documentManageListPage: '/document',
    documentManageSavePage: '/document/folder/:id',
    documentUploadFileSavePage: '/document/file/:id',
    documentGroupPermissionListPage: '/document-group-permission',
    documentGroupPermissionSavePage: '/document-group-permission/:id',
    documentSearchListPage: '/document-search',
    documentPermissionConfigListPage: '/document-permission-config',
    documentPermissionConfigSavePage: '/document-permission-config/:id',
};
export default {
    documentPermissionListPage: {
        path: paths.documentPermissionListPage,
        auth: true,
        component: DocumentPermissionListPage,
        permission: [apiConfig.documentGroupPermission.getList.baseURL],
        pageOptions: {
            objectName:  commonMessage.documentPermission,
            renderBreadcrumbs: (messages, translate, title, options = {}) => {
                return [
                    {
                        breadcrumbName: translate.formatMessage(commonMessage.document),
                        path: paths.documentManageListPage,
                    },
                    { breadcrumbName: translate.formatMessage(messages.documentPermission) }];
            },
        },
    },
    documentPermissionSavePage: {
        path: paths.documentPermissionSavePage,
        component: DocumentPermissionSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.documentGroupPermission.create.baseURL, apiConfig.documentGroupPermission.update.baseURL],
        pageOptions: {
            objectName: commonMessage.documentPermission,
            listPageUrl: paths.documentPermissionListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.documentPermission),
                        path: paths.documentGroupPermissionListPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    documentUploadFileSavePage: {
        path: paths.documentUploadFileSavePage,
        component: DocumentUploadFileSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.document.create.baseURL, apiConfig.document.update.baseURL],
        pageOptions: {
            objectName: commonMessage.file,
            listPageUrl: paths.documentManageListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.document),
                        path: paths.documentManageListPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
   
    documentManageListPage: {
        path: paths.documentManageListPage,
        auth: true,
        component: DocumentManageListPage,
        permission: [apiConfig.document.getList.baseURL],
        pageOptions: {
            objectName: commonMessage.document,
            renderBreadcrumbs: (messages, translate, title, options = {}) => {
                return [{ breadcrumbName: translate.formatMessage(messages.document) }];
            },
        },
    },
    documentManageSavePage: {
        path: paths.documentManageSavePage,
        component: DocumentManageSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.document.create.baseURL, apiConfig.document.update.baseURL],
        pageOptions: {
            objectName: commonMessage.folder,
            listPageUrl: paths.documentManageListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.document),
                        path: paths.documentManageListPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    documentGroupPermissionListPage: {
        path: paths.documentGroupPermissionListPage,
        auth: true,
        component: DocumentGroupPermissionListPage,
        permission: [apiConfig.documentGroupPermission.getList.baseURL],
        pageOptions: {
            objectName: commonMessage.groupPermission,
            renderBreadcrumbs: (messages, translate, title, options = {}) => {
                return [{ breadcrumbName: translate.formatMessage(messages.groupPermission) }];
            },
        },
    },
    documentGroupPermissionSavePage: {
        path: paths.documentGroupPermissionSavePage,
        component: DocumentGroupPermissionSavePage,
        separateCheck: true,
        auth: true,
        permission: [
            apiConfig.documentGroupPermission.create.baseURL,
            apiConfig.documentGroupPermission.update.baseURL,
        ],
        pageOptions: {
            objectName: commonMessage.groupPermission,
            listPageUrl: paths.documentGroupPermissionListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.groupPermission),
                        path: paths.documentGroupPermissionListPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    documentSearchListPage: {
        path: paths.documentSearchListPage,
        auth: true,
        component: DocumentSearchListPage,
        permission: [apiConfig.document.searchFile.baseURL],
        pageOptions: {
            objectName: commonMessage.searchDocument,
            renderBreadcrumbs: (messages, translate, title, options = {}) => {
                return [{ breadcrumbName: translate.formatMessage(messages.searchDocument) }];
            },
        },
    },
    documentPermissionConfigListPage: {
        path: paths.documentPermissionConfigListPage,
        auth: true,
        component: DocumentPermissionConfigListPage,
        permission: [apiConfig.documentGroupPermission.getList.baseURL],
        pageOptions: {
            objectName: commonMessage.permissionConfig,
            renderBreadcrumbs: (messages, translate, title, options = {}) => {
                return [{ breadcrumbName: translate.formatMessage(messages.permissionConfig) }];
            },
        },
    },
    documentPermissionConfigSavePage: {
        path: paths.documentPermissionConfigSavePage,
        component: DocumentPermissionConfigSavePage,
        separateCheck: true,
        auth: true,
        permission: [
            apiConfig.memberDocument.create.baseURL,
            apiConfig.memberDocument.update.baseURL,
        ],
        pageOptions: {
            objectName: commonMessage.permissionConfig,
            listPageUrl: paths.documentPermissionConfigListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    {
                        breadcrumbName: t.formatMessage(commonMessage.permissionConfig),
                        path: paths.documentPermissionConfigListPage,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
