import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React from 'react';
import { defineMessages } from 'react-intl';
import { generatePath } from 'react-router-dom';
import JobForm from './JobForm';

const messages = defineMessages({
    objectName: 'công việc tuyển dụng',
});

const JobSavePage = () => {
    const translate = useTranslate();
    const { detail, mixinFuncs, setIsChangedFormValues, isEditing, loading, title } = useSaveBase({
        apiConfig: apiConfig.job,
        options: {
            getListUrl: generatePath(routes.jobListPage.path),
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
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
            routes={[
                {
                    breadcrumbName: translate.formatMessage(commonMessage.job),
                    path: generatePath(routes.jobListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <JobForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail || {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};
export default JobSavePage;
