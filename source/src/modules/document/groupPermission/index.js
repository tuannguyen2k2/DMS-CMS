import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Modal } from 'antd';
import React from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { defineMessages, useIntl } from 'react-intl';

const DocumentGroupPermissionListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const intl = useIntl();

    const notificationMessage = defineMessages({
        deleteSuccess: 'Delete {object} successfully',
        deleteTitle: 'The corresponding permission configuration will also be deleted. Are you sure delete this {objectName}?',
        ok: 'Yes',
        cancel: 'No',
    });

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.documentGroupPermission,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    kind: 1,
                };
            };
            funcs.showDeleteItemConfirm = (id) => {
                if (!apiConfig.documentGroupPermission.delete) throw new Error('apiConfig.delete is not defined');

                Modal.confirm({
                    title: intl.formatMessage(notificationMessage.deleteTitle, { objectName: translate.formatMessage(pageOptions.objectName) }),
                    content: '',
                    okText: intl.formatMessage(notificationMessage.ok),
                    cancelText: intl.formatMessage(notificationMessage.cancel),
                    centered: true,
                    onOk: () => {
                        mixinFuncs.handleDeleteItem(id);
                    },
                });
            };
        },
    });

    const columns = [
        { title: translate.formatMessage(commonMessage.name), dataIndex: 'name' },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.name),
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DocumentGroupPermissionListPage;
