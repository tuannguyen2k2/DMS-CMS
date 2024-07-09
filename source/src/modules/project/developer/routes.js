import apiConfig from '@constants/apiConfig';
import DeveloperProjectListPage from '.';
import DeveloperProjectTabPage from './ProjectTabPage';
import DeveloperProjectTaskListPage from './projectTask';
import DeveloperProjectTaskSavePage from './projectTask/ProjectTaskSavePage';
import DeveloperProjectTaskLogListPage from './projectTask/projectTaskLog';
import DeveloperProjectTaskLogSavePage from './projectTask/projectTaskLog/projectTaskLogSavePage';
import ProjectTabPage from '../ProjectTabPage';
import ProjectTaskListPage from '../projectTask';
import ProjectTaskSavePage from '../projectTask/ProjectTaskSavePage';

export default {
    developerProjectListPage: {
        path: '/developer-project',
        title: 'Developer Project',
        auth: true,
        component: DeveloperProjectListPage,
        permissions: [apiConfig.project.developerProject.baseURL],
    },
    developerProjectTabPage: {
        path: '/developer-project/project-tab',
        title: 'Project Tab',
        auth: true,
        component: ProjectTabPage,
        keyActiveTab: 'activeDeveloperProjectTab',
        permissions: [apiConfig.project.developerProject.baseURL],
    },
    developerProjectTaskListPage: {
        path: '/developer-project/task',
        title: 'Task',
        auth: true,
        component: ProjectTaskListPage,
        permissions: [apiConfig.projectTask.getList.baseURL],
    },
    developerProjectTaskSavePage: {
        path: '/developer-project/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: ProjectTaskSavePage,
        permissions: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
    developerProjectTaskLogListPage: {
        path: '/developer-project/task/task-log',
        title: 'Task Log List Page',
        auth: true,
        component: DeveloperProjectTaskLogListPage,
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
    developerProjectTaskLogSavePage: {
        path: '/developer-project/task/task-log/:id',
        title: 'Task Log Save Page',
        auth: true,
        component: DeveloperProjectTaskLogSavePage,
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
