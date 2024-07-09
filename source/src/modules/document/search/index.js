import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Space, Tag } from 'antd';
import React from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { CiFileOn } from 'react-icons/ci';
import { FiUpload } from 'react-icons/fi';
import { PiFolderNotch } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../document.module.scss';
import useFetch from '@hooks/useFetch';
import { FieldTypes } from '@constants/formConfig';
import useNotification from '@hooks/useNotification';
import { PdfIcon, PowerPointIcon, WordIcon } from '@assets/icons';

const DocumentSearchListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const path = queryParameters.get('path');
    const fileName = queryParameters.get('fileName');
    const tagsParam = queryParameters.get('tags');
    const { pathname: pagePath, search: searchPath } = useLocation();
    const navigate = useNavigate();
    const notification = useNotification();
    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams, setQueryParams, queryParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.document.searchFile,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(pageOptions.objectName),
            },
            override: (funcs) => {
                funcs.getItemDetailLink = (dataRow) => {
                    if (dataRow?.kind == 1) {
                        return `${pagePath}/folder/${dataRow.id}?path=${path}`;
                    } else if (dataRow?.kind == 2) {
                        return `${pagePath}/file/${dataRow.id}?path=${path}`;
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
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.documentManageListPage.path + `?path=${record.documentPath}${record.fileName}/`);
    };
    const handleOnClickPath = (event, record) => {
        event.preventDefault();
        navigate(routes.documentManageListPage.path + `?path=${record.documentPath}`);
    };
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

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
                if (fileName.includes('.docx')) {
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
                    <div>
                        <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                            {fileName}
                        </div>
                        {record?.documentPath !== '/' && <div>{record?.documentPath}</div>}
                    </div>
                ) : (
                    <div>
                        <div>{fileName}</div>
                        <div onClick={(event) => handleOnClickPath(event, record)} className={styles.customDiv}>
                            {record?.documentPath}
                        </div>
                    </div>
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
    ];
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
            options: tags,
            placeholder: translate.formatMessage(commonMessage.tag),
            mode: 'multiple',
            dropdownStyle: { maxHeight: 100 },
            style: { height: 100 },
        },
    ];

    return (
        <PageWrapper routes={path ? breadCrumbs : pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    ...queryFilter,
                    tags: queryFilter?.tags?.split(','),
                    initialValues: { ...queryFilter, tags: queryFilter?.tags?.split(',') },
                })}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={(fileName || tagsParam) && !loading ? data : null}
                        loading={loading}
                        pagination={fileName || tagsParam ? pagination : null}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DocumentSearchListPage;
