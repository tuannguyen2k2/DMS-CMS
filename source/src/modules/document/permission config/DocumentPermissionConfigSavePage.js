import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React from 'react';
import routes from '@routes';
import DocumentPermissionConfigForm from './DocumentPermissionConfigForm';
import { showErrorMessage } from '@services/notifyService';

const DocumentPermissionConfigSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.memberDocument.getById,
            create: apiConfig.memberDocument.create,
            update: apiConfig.memberDocument.update,
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
                    kind: 1,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: 1,
                };
            };
            funcs.onSaveError = (err) => {
                if (err.code === 'ERROR-MEMBER_DOCUMENT-0001') {
                    showErrorMessage(translate.formatMessage(commonMessage.error),translate.formatMessage(commonMessage.existPermissionConfig));
                } else {
                    mixinFuncs.handleShowErrorMessage(err, showErrorMessage);
                }
                mixinFuncs.setSubmit(false);
            };
        },
    });
    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <DocumentPermissionConfigForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default DocumentPermissionConfigSavePage;
