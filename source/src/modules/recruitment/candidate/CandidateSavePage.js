import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import React from 'react';
import { generatePath } from 'react-router-dom';
import CandidateForm from './CandidateForm';

const CandidateSavePage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const jobId = queryParameters.get('jobId');
    const { detail, mixinFuncs, setIsChangedFormValues, isEditing, loading, title } = useSaveBase({
        apiConfig: apiConfig.candidate,
        options: {
            getListUrl: generatePath(routes.candidateListPage.path),
            objectName: translate.formatMessage(commonMessage.candidate),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                console.log(data);
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    jobId,
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
                {
                    breadcrumbName: translate.formatMessage(commonMessage.candidate),
                    path: generatePath(routes.candidateListPage.path),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <CandidateForm
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
export default CandidateSavePage;
