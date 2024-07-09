import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import { categoryKind } from '@constants/masterData';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { generatePath, useLocation, useParams, useNavigate } from 'react-router-dom';
import routes from '@routes';
import ProjectTaskLogForm from './projectTaskLogForm';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import { commonMessage } from '@locales/intl';

const messages = defineMessages({
    objectName: 'Nhật ký',
});

function LeaderProjectTaskLogSavePage({ getListUrl, breadcrumbName }) {
    const translate = useTranslate();
    const location = useLocation();
    const state = location.state.prevPath;
    const search = location.search;
    const paramHead = routes.leaderProjectListPage.path;
    const taskLogParam = routes.leaderProjectTaskLogListPage.path;
    const taskLogId = useParams();
    const { detail, onSave, mixinFuncs, setIsChangedFormValues, isEditing, errors, loading, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.projectTaskLog.getById,
            create: apiConfig.projectTaskLog.create,
            update: apiConfig.projectTaskLog.update,
        },
        options: {
            getListUrl: getListUrl ? getListUrl : generatePath(routes.leaderProjectTaskLogListPage.path, { taskLogId }),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                    status: 1,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={
                breadcrumbName ||
                routes.projectTaskLogSavePage.breadcrumbs(
                    commonMessage,
                    paramHead,
                    routes.leaderProjectTabPage.path,
                    taskLogParam,
                    search,
                    title,
                    true,
                )
            }
        >
            <ProjectTaskLogForm
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

export default LeaderProjectTaskLogSavePage;
