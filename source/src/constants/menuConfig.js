import React from 'react';
import { UsergroupAddOutlined, ControlOutlined, InboxOutlined, DollarOutlined } from '@ant-design/icons';
import routes from '@routes';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';
import { PiProjectorScreenChart } from 'react-icons/pi';

const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="User Management" />,
        key: 'user-management',
        icon: <UsergroupAddOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Admins" />,
                key: 'admin',
                path: routes.adminsListPage.path,
                permission: [apiConfig.account.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Personnel" />,
                key: 'personnel',
                path: routes.userListPage.path,
                permission: [apiConfig.user.getList.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Project Management" />,
        key: 'project-management',
        icon: <PiProjectorScreenChart />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Project" />,
                key: 'project',
                path: routes.projectListPage?.path,
                permission: [apiConfig.project.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý vai trò dự án" />,
                key: 'project-role-management',
                path: routes.projectRoleListPage.path,
                permission: apiConfig.projectRole.getList.baseURL,
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Project Management" />,
        key: 'user-project-management',
        icon: <PiProjectorScreenChart />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Dự án bạn là leader" />,
                key: 'leader-project',
                path: routes.leaderProjectListPage?.path,
                permission: [apiConfig.project.leaderProject.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Developer Project" />,
                key: 'developer-project',
                path: routes.developerProjectListPage?.path,
                permission: [apiConfig.project.developerProject.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Document Management" />,
        key: 'Document-management',
        icon: <InboxOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Document" />,
                key: 'document',
                path: routes.documentManageListPage.path,
                permission: [apiConfig.document.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Search document" />,
                key: 'search',
                path: routes.documentSearchListPage.path,
                permission: [apiConfig.document.searchFile.baseURL],
            },
            // {
            //     label: <FormattedMessage defaultMessage="Document Permission" />,
            //     key: 'document-permission',
            //     path: routes.documentPermissionListPage.path,
            //     permission: [apiConfig.document.getList.baseURL],
            // },
            {
                label: <FormattedMessage defaultMessage="Permission Group" />,
                key: 'permission-group',
                path: routes.documentGroupPermissionListPage.path,
                permission: [apiConfig.documentGroupPermission.getList.baseURL],
            },
            {
                label: <FormattedMessage defaultMessage="Permission Config" />,
                key: 'permission-config',
                path: routes.documentPermissionConfigListPage.path,
                permission: [apiConfig.documentGroupPermission.getList.baseURL],
            },
        ],
    },
    // {
    //     label: <FormattedMessage defaultMessage="Recruitment management" />,
    //     key: 'recruitment-management',
    //     icon: <PiProjectorScreenChart />,
    //     children: [
    //         {
    //             label: <FormattedMessage defaultMessage="Job Management" />,
    //             key: 'job management',
    //             path: routes.jobListPage?.path,
    //             permission: [apiConfig.job.getList.baseURL],
    //         },
    //     ],
    // },
    {
        label: <FormattedMessage defaultMessage="Quản lý lương thưởng" />,
        key: 'salary-management',
        icon: <DollarOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Bảng lương định kỳ" />,
                key: 'salary management',
                path: routes.salaryPeriodListPage?.path,
                permission: [apiConfig.salaryPeriod.getList.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý lương thưởng" />,
        key: 'salary-management',
        icon: <DollarOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Bảng lương của tôi" />,
                key: 'my-salary-management',
                path: routes.mySalaryListPage?.path,
                permission: [apiConfig.salaryPeriodDetail.mySalary.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Settings" />,
        key: 'system-management',
        icon: <ControlOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản lý phòng ban & quyền hạn" />,
                key: 'role',
                path: routes.groupPermissionPage.path,
                permission: [apiConfig.groupPermission.getGroupList.baseURL],
            },
        ],
    },
];

export default navMenuConfig;
