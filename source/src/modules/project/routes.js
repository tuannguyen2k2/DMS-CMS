import apiConfig from '@constants/apiConfig';
import ProjectTabPage from './ProjectTabPage';
import ProjectListPage from '.';
import ProjectSavePage from './ProjectSavePage';
import ProjectTaskListPage from './projectTask';
import ProjectTaskSavePage from './projectTask/ProjectTaskSavePage';
import ProjectRoleListPage from './projectRole';
import ProjectRoleSavePage from './projectRole/projectRoleSavePage';
import ProjectMemberSavePage from './member/ProjectMemberSavePage';
import ProjectMemberListPage from './member';
import ProjectTaskLogSavePage from './projectTask/projectTaskLog/projectTaskLogSavePage';
import ProjectTaskLogListPage from './projectTask/projectTaskLog';
import LeaderProjectListPage from './leader';
import LeaderProjectTabPage from './leader/ProjectTabPage';
import ProjectStorySavePage from './projectStory/ProjectStorySavePage';
import ProjectStoryListPage from './projectStory';

export default {
    projectListPage: {
        path: '/project',
        title: 'Project',
        auth: true,
        component: ProjectListPage,
        permissions: [apiConfig.project.getList.baseURL],
    },
    projectSavePage: {
        path: '/project/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectSavePage,
        permissions: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    projectStoryListPage: {
        path: '/project/feature',
        title: 'Project Save Page',
        auth: true,
        component: ProjectStoryListPage,
        permissions:  [apiConfig.story.getList.baseURL],
    },
    projectStorySavePage: {
        path: '/project/feature/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectStorySavePage,
        permissions: [apiConfig.story.create.baseURL, apiConfig.story.update.baseURL],
    },
    projectTabPage: {
        path: '/project/project-tab',
        title: 'Project Tab',
        auth: true,
        component: ProjectTabPage,
        keyActiveTab: 'activeProjectTab',
        permissions: [apiConfig.project.getList.baseURL],
    },
    projectTaskListPage: {
        path: '/project/task',
        title: 'Task',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
        breadcrumbs: (message, paramHead, taskParam, search, isTaskTab) => {
            return [
                { breadcrumbName: "Dự án", path: paramHead },
                {
                    breadcrumbName: isTaskTab ? "Quản lý chung" : message.task.defaultMessage,
                    path: taskParam + search,
                },
                { breadcrumbName: message.task.defaultMessage },
            ];
        },
    },
    projectTaskSavePage: {
        path: '/project/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: ProjectTaskSavePage,
        permissions: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
    projectRoleListPage: {
        path: '/project-role',
        title: 'Project Role',
        auth: true,
        component: ProjectRoleListPage,
        permissions: [apiConfig.projectRole.getList.baseURL],
    },
    projectRoleSavePage: {
        path: '/project-role/:id',
        title: 'Project Role Save Page',
        auth: true,
        component: ProjectRoleSavePage,
        permissions: [apiConfig.projectRole.create.baseURL, apiConfig.projectRole.update.baseURL],
    },
    projectMemberSavePage: {
        path: '/project/member/:id',
        title: 'Project Save Page',
        auth: true,
        component: ProjectMemberSavePage,
        permissions: [apiConfig.memberProject.create.baseURL, apiConfig.memberProject.update.baseURL],
    },
    projectMemberListPage: {
        path: '/project/member',
        title: 'Project Member',
        auth: true,
        component: ProjectMemberListPage,
        permissions: [apiConfig.memberProject.getList.baseURL],
    },
    projectTaskLogListPage: {
        path: '/project/task/task-log',
        title: 'Task Log List Page',
        auth: true,
        component: ProjectTaskLogListPage,
        permissions: [apiConfig.projectTaskLog.getList.baseURL],
        breadcrumbs: (message, paramHead, taskParam, search, isTaskTab) => {
            return [
                { breadcrumbName: message.project.defaultMessage, path: paramHead },
                {
                    breadcrumbName: isTaskTab ? message.generalManage.defaultMessage : message.task.defaultMessage,
                    path: taskParam + search,
                },
                { breadcrumbName: message.taskLog.defaultMessage },
            ];
        },
    },
    projectTaskLogSavePage: {
        path: '/project/task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: ProjectTaskLogSavePage,
        permissions: [apiConfig.projectTaskLog.create.baseURL, apiConfig.projectTaskLog.update.baseURL],
        breadcrumbs: (message, paramHead, taskParam, taskLogParam, search, title, isTaskTab) => {
            return [
                { breadcrumbName: message.project.defaultMessage, path: paramHead },
                {
                    breadcrumbName: isTaskTab ? message.generalManage.defaultMessage : message.task.defaultMessage,
                    path: taskParam + search,
                },
                { breadcrumbName: message.taskLog.defaultMessage, path: taskLogParam + search },
                { breadcrumbName: title },
            ];
        },
    },
};
