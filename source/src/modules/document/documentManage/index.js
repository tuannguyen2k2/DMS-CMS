import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { BsShieldLock } from 'react-icons/bs';
import { CiFileOn } from 'react-icons/ci';
import { FiUpload } from 'react-icons/fi';
import { PiFolderNotch } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../document.module.scss';
import { PdfIcon, PowerPointIcon, WordIcon } from '@assets/icons';

const DocumentManageListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const path = queryParameters.get('path');
    const { pathname: pagePath, search: searchPath } = useLocation();
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState([]);
    const [hasWritePermission, setHasWritePermission] = useState(false);
    const [hasWriteOrReadPermission, setHasWriteOrReadPermission] = useState(false);
    const { profile } = useAuth();
    const notification = useNotification();
    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams, setQueryParams, queryParams } =
        useListBase({
            apiConfig: apiConfig.document,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(pageOptions.objectName),
            },
            override: (funcs) => {
                funcs.getItemDetailLink = (dataRow) => {
                    if (dataRow?.kind == 1) {
                        return `${pagePath}/folder/${dataRow.id}` + (path ? `?path=${path}` : '');
                    } else if (dataRow?.kind == 2) {
                        return `${pagePath}/file/${dataRow.id}` + (path ? `?path=${path}` : '');
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
                funcs.handleGetListError = (err) => {
                    if (err.code === 'ERROR-USER-0003') {
                        return;
                    } else {
                        notification({ type: 'error', message: 'Get list error' });
                    }
                };
            },
        });
    const { execute: executeGetPermission, loading: getPermissionLoading } = useFetch(
        apiConfig.documentPermission.listByUser,
        {
            immediate: false,
        },
    );

    useEffect(() => {
        setHasWriteOrReadPermission(false);
        executeGetPermission({
            params: {
                path: path,
            },
            onCompleted: (res) => {
                setPermissions(res?.data?.content);
                let notHasPermission = false;
                res?.data?.content?.map((permission) => {
                    if (permission?.documentPath == path && permission?.permissionKind == 2) {
                        notHasPermission = true;
                        setHasWritePermission(true);
                    }
                    if (
                        permission?.documentPath === path &&
                        (permission?.permissionKind == 2 || permission?.permissionKind == 1)
                    ) {
                        setHasWriteOrReadPermission(true);
                    }
                });
                if (!notHasPermission) {
                    setHasWritePermission(false);
                }
            },
            onError: (res) => {
                if (res.code === 'ERROR-USER-0003')
                    notification({
                        type: 'warning',
                        message: translate.formatMessage(commonMessage.notAuthorizedDocuments),
                    });
            },
        });
    }, [path]);

    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.documentManageListPage.path + `?path=${record.documentPath}${record.fileName}/`);
    };
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }
    const handleOnclickDocumentPermission = (event, record) => {
        event.preventDefault();

        navigate(
            routes.documentPermissionListPage.path +
                `?path=${record.documentPath}${record.fileName}` +
                (record.kind == 1 ? '/' : ''),
        );
    };

    const columns = [
        {
            title: '#',
            align: 'center',
            width: 60,
            render: (record) => {
                if (record?.kind == 1) {
                    return (
                        <div>
                            <PiFolderNotch size={25} />
                        </div>
                    );
                }
                const fileName = record?.fileName;
                if (fileName.includes('.docx') || fileName.includes('.doc')) {
                    return (
                        <div>
                            <WordIcon size={20} />
                        </div>
                    );
                } else if (fileName.includes('.pdf')) {
                    return (
                        <div>
                            <PdfIcon size={20} />
                        </div>
                    );
                } else if (fileName.includes('.pptx')) {
                    return (
                        <div>
                            <PowerPointIcon size={20} />
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <CiFileOn size={25} />
                        </div>
                    );
                }
            },
        },
        {
            title: translate.formatMessage(commonMessage.name),
            dataIndex: 'fileName',
            width: 300,
            render: (fileName, record) =>
                record?.kind == 1 ? (
                    <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                        {fileName}
                    </div>
                ) : (
                    <div>{fileName}</div>
                ),
        },
        {
            title: translate.formatMessage(commonMessage.modifiedDate),
            dataIndex: 'modifiedDate',
            width: 180,
            render: (modifiedDate) => {
                const result = convertStringToDateTime(modifiedDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(7, 'hour');
                const modifiedDateString = convertDateTimeToString(result, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateString}</div>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            width: 180,
            render: (createdDate) => {
                const result = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(7, 'hour');
                const modifiedDateString = convertDateTimeToString(result, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateString}</div>;
            },
        },
        profile?.kind != 3 && {
            title: translate.formatMessage(commonMessage.documentPermission),
            align: 'center',
            width: 100,
            render: (_, record) => (
                <BaseTooltip title={translate.formatMessage(commonMessage.viewDocumentPermission)}>
                    <div style={{ cursor: 'pointer' }} onClick={(e) => handleOnclickDocumentPermission(e, record)}>
                        <BsShieldLock color="#1677ff" />
                    </div>
                </BaseTooltip>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.tag),
            dataIndex: 'tags',
            width: 200,
            render: (tags) => {
                return (
                    <Space size={4} wrap>
                        {tags?.map((tag) => (
                            <Tag key={tag}>{truncateText(tag, 20)}</Tag>
                        ))}
                    </Space>
                );
            },
        },
        (profile?.kind != 3 || path) &&
            mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '150px' }, {}, permissions),
    ].filter(Boolean);
    const breadCrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.document),
            path: routes.documentManageListPage.path,
        },
    ];
    const filterPathBreadCrumb = (keyword) => {
        const keywordIndex = path.indexOf(keyword);
        return path.substring(0, keywordIndex + keyword.length);
    };
    const titleBreadCrumbsArray = path?.split('/')?.filter((word) => word.length > 0);
    path &&
        titleBreadCrumbsArray.map((title, index) => {
            if (index == titleBreadCrumbsArray.length - 1) {
                breadCrumbs.push({
                    breadcrumbName: title,
                });
            } else {
                breadCrumbs.push({
                    breadcrumbName: title,
                    path: pagePath + `?path=${filterPathBreadCrumb(title)}/`,
                });
            }
        });
    const { data: tags, execute: executeTags } = useFetch(apiConfig.document.getTags, {
        immediate: true,
        mappingData: ({ data }) => data.tags.map((item) => ({ value: item, label: item })),
    });

    const searchFields = [
        {
            key: 'fileName',
            placeholder: translate.formatMessage(commonMessage.name),
        },
        {
            key: 'tags',
            type: FieldTypes.SELECT,
            placeholder: translate.formatMessage(commonMessage.tag),
            options: tags,
            mode: 'multiple',
            dropdownStyle: { maxHeight: 100 },
            style: { height: 100 },
        },
    ];
    const params = searchPath.split('path');
    const buttons = [
        path && {
            linkTo: pagePath + '/file/create' + '?path' + params[params.length - 1],
            component: (
                <Button
                    type="primary"
                    style={{ display: 'flex', alignItems: 'center' }}
                    loading={getPermissionLoading}
                    disabled={!hasWritePermission && profile?.kind == 3}
                >
                    <FiUpload size={15} />
                    <span style={{ paddingLeft: '4px' }}>{translate.formatMessage(commonMessage.uploadFile)}</span>
                </Button>
            ),
        },
        (profile?.kind != 3 || path) && {
            linkTo: path
                ? pagePath + '/folder/create' + '?path' + params[params.length - 1]
                : pagePath + '/folder/create',
            component: (
                <Button
                    type="primary"
                    style={{ display: 'flex', alignItems: 'center' }}
                    loading={getPermissionLoading}
                    disabled={!hasWritePermission && profile?.kind == 3}
                >
                    <PiFolderNotch size={20} />
                    <span style={{ paddingLeft: '4px' }}>{translate.formatMessage(commonMessage.createFolder)}</span>
                </Button>
            ),
        },
    ].filter(Boolean);
    console.log(hasWriteOrReadPermission);
    return (
        <PageWrapper
            routes={path && path !== '/' ? breadCrumbs : pageOptions.renderBreadcrumbs(commonMessage, translate)}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    ...queryFilter,
                    tags: queryFilter?.tags?.split(','),
                })}
                actionBar={mixinFuncs.renderActionBar({ buttons })}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={hasWriteOrReadPermission || path == null || path == '/' ? data : []}
                        loading={getPermissionLoading && loading}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DocumentManageListPage;
