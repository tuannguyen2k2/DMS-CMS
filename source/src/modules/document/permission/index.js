import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { documentPermissionKindOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { useLocation } from 'react-router-dom';
import { Tag } from 'antd';
import routes from '@routes';

const DocumentPermissionListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const path = queryParameters.get('path');
    const { pathname: pagePath, search: searchPath } = useLocation();
    const documentPermissionKindValues = translate.formatKeys(documentPermissionKindOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams, setQueryParams, queryParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.documentGroupPermission.listByPath,
                getById: apiConfig.documentGroupPermission.getById,
                update: apiConfig.documentGroupPermission.update,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(pageOptions.objectName),
            },
            override: (funcs) => {
                funcs.prepareGetListParams = (params) => {
                    return {
                        kind: 1,
                        ...params,
                    };
                };
                funcs.mappingData = (response) => {
                    if (response.result === true) {
                        return {
                            data: response.data.content,
                            total: response.data.totalElements,
                        };
                    }
                };
                funcs.changeFilter = (filter) => {
                    const path = queryParams.get('path');
                    if (path) {
                        setQueryParams(serializeParams({ ...filter, path }));
                    } else {
                        setQueryParams(serializeParams(filter));
                    }
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?path=${path}`;
                };
            },
        });

    const columns = [
        { title: translate.formatMessage(commonMessage.groupPermissionName), dataIndex: 'name' },
        {
            title: translate.formatMessage(commonMessage.documentPermission),
            dataIndex: 'documentPermissions',
            width: 300,
            align: 'center',
            render: (documentPermissions) => {
                return (
                    <div
                        style={{ display: 'flex', whiteSpace: 'pre-wrap', justifyContent: 'end', marginRight: '30px' }}
                    >
                        {documentPermissionKindValues?.map((item) => {
                            let style = { margin: '0 10px', color: 'red' };
                            documentPermissions?.map((permission) => {
                                if (permission.permissionKind == item.value) {
                                    style = { margin: '0 10px', color: 'green' };
                                }
                            });

                            return (
                                <Tag key={item.value} style={style} color={style.color}>
                                    {item.label}
                                </Tag>
                            );
                        })}
                    </div>
                );
            },
        },

        mixinFuncs.renderActionColumn({ edit: true }, { width: '150px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.groupPermissionName),
        },
    ];

    const filterPathBreadCrumbs = (path) => {
        const lastSlashIndex = path.lastIndexOf('/');
        const secondLastSlashIndex = path.lastIndexOf('/', lastSlashIndex - 1);
        if (path.endsWith('/')) {
            return path.slice(0, secondLastSlashIndex + 1);
        }
        return path.slice(0, lastSlashIndex + 1);
    };
   
    const breadCrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.document),
            path: routes.documentManageListPage.path + `?path=${filterPathBreadCrumbs(path)}`,
        },
        { breadcrumbName: translate.formatMessage(commonMessage.documentPermission) },
    ];
    const pathSplitSlash = path.split('/');
    return (
        <PageWrapper routes={breadCrumbs}>
            <ListPage
                title={
                    <span style={{ fontWeight: 400 }}>
                        {
                            pathSplitSlash[
                                pathSplitSlash.length - (pathSplitSlash[pathSplitSlash.length - 1] !== '' ? 1 : 2)
                            ]
                        }
                    </span>
                }
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 20px 20px 0' }}></div>
                        <BaseTable
                            onChange={mixinFuncs.changePagination}
                            columns={columns}
                            dataSource={data}
                            loading={loading}
                            pagination={pagination}
                        />
                    </div>
                }
            />
        </PageWrapper>
    );
};

export default DocumentPermissionListPage;
