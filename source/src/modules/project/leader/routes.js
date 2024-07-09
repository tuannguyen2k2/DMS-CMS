import apiConfig from '@constants/apiConfig';
import LeaderProjectListPage from '.';
import LeaderProjectTabPage from './ProjectTabPage';
import LeaderProjectTaskListPage from './projectTask';
import LeaderProjectTaskSavePage from './projectTask/ProjectTaskSavePage';
import LeaderProjectTaskLogListPage from './projectTask/projectTaskLog';
import LeaderProjectTaskLogSavePage from './projectTask/projectTaskLog/projectTaskLogSavePage';
import ProjectTabPage from '../ProjectTabPage';
import ProjectTaskListPage from '../projectTask';
import ProjectTaskSavePage from '../projectTask/ProjectTaskSavePage';

export default {
    leaderProjectListPage: {
        path: '/leader-project',
        title: 'Leader Project',
        auth: true,
        component: LeaderProjectListPage,
        permissions: [apiConfig.project.leaderProject.baseURL],
    },
    leaderProjectTabPage: {
        path: '/leader-project/project-tab',
        title: 'Project Tab',
        auth: true,
        component: ProjectTabPage,
        keyActiveTab: 'activeLeaderProjectTab',
        permissions: [apiConfig.project.leaderProject.baseURL],
    },
    leaderProjectTaskListPage: {
        path: '/leader-project/task',
        title: 'Task',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    leaderProjectTaskSavePage: {
        path: '/leader-project/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: ProjectTaskSavePage,
        permissions: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
    leaderProjectTaskLogListPage: {
        path: '/leader-project/task/task-log',
        title: 'Task Log List Page',
        auth: true,
        component: LeaderProjectTaskLogListPage,
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
    leaderProjectTaskLogSavePage: {
        path: '/leader-project/task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: LeaderProjectTaskLogSavePage,
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
