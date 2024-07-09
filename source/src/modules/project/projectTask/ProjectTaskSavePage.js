import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams } from 'react-router-dom';
import routes from '@routes';
import ProjectTaskForm from './ProjectTaskForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import useAuth from '@hooks/useAuth';

const messages = defineMessages({
    objectName: 'Task',
});

function ProjectTaskSavePage() {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const storyId = queryParameters.get('storyId');
    const storyName = queryParameters.get('storyName');
    const { pathname: pagePath } = useLocation();
    const projectTaskId = useParams();
    const { isAdmin } = useAuth();
    const pathProject = () => {
        if (pagePath.includes(routes.projectTaskListPage.path)) {
            return routes.projectListPage.path;
        } else if (pagePath.includes(routes.developerProjectTaskListPage.path)) {
            return routes.developerProjectListPage.path;
        } else if (pagePath.includes(routes.leaderProjectTaskListPage.path)) {
            return routes.leaderProjectListPage.path;
        }
    };
    const pathTab = () => {
        if (pagePath.includes(routes.projectTaskListPage.path)) {
            return routes.projectTabPage.path;
        } else if (pagePath.includes(routes.developerProjectTaskListPage.path)) {
            return routes.developerProjectTabPage.path;
        } else if (pagePath.includes(routes.leaderProjectTaskListPage.path)) {
            return routes.leaderProjectTabPage.path;
        }
    };
    const pathTask = () => {
        if (pagePath.includes(routes.projectTaskListPage.path)) {
            return routes.projectTaskListPage.path;
        } else if (pagePath.includes(routes.developerProjectTaskListPage.path)) {
            return routes.developerProjectTaskListPage.path;
        } else if (pagePath.includes(routes.leaderProjectTaskListPage.path)) {
            return routes.leaderProjectTaskListPage.path;
        }
    };
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectTask.getById,
            create: apiConfig.projectTask.create,
            update: apiConfig.projectTask.update,
        },
        options: {
            getListUrl: generatePath(
                pathTask(),
                active ? { projectId, projectName, active } : { projectId, projectName },
            ),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                if (!isAdmin()) {
                    data.state = detail.state;
                }
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                    storyId: storyId,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    projectId: projectId,
                    userId: data.developerId,
                    status: 1,
                    storyId: storyId,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-PROJECT-ERROR-0001') {
                    showErrorMessage('Không thể tạo task khi chức năng chưa ở trạng thái đang xử lý');
                    mixinFuncs.setSubmit(false);
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                    mixinFuncs.setSubmit(false);
                }
            };
        },
    });

    const setBreadRoutes = () => {
        const breadRoutes = [
            {
                breadcrumbName: translate.formatMessage(commonMessage.project),
                path: pathProject(),
            },
        ];

        if (active) {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path: pathTab() + `?projectId=${projectId}&projectName=${projectName}&active=${active}`,
            });
        } else {
            breadRoutes.push({
                breadcrumbName: translate.formatMessage(commonMessage.generalManage),
                path: pathTab() + `?projectId=${projectId}&projectName=${projectName}`,
            });
        }
        breadRoutes.push({
            breadcrumbName: translate.formatMessage(commonMessage.task),
            path:
                pathTask() +
                `?projectId=${projectId}&storyId=${storyId}&projectName=${projectName}&storyName=${storyName}`,
        });
        breadRoutes.push({ breadcrumbName: title });

        return breadRoutes;
    };
    return (
        <PageWrapper loading={loading} routes={setBreadRoutes()} title={title}>
            <ProjectTaskForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default ProjectTaskSavePage;
