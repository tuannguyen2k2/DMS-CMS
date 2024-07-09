import { DollarOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { projectTaskState, statusOptions } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { IconBrandTeams, IconCategory } from '@tabler/icons-react';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../project.module.scss';

// import icon_team_1 from '@assets/images/team-Members-Icon.png';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
const message = defineMessages({
    objectName: 'Dự án',
});

const DeveloperProjectListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const leaderName = queryParameters.get('leaderName');
    const developerName = queryParameters.get('developerName');
    localStorage.setItem('pathPrev', location.search);
    const [hasError, setHasError] = useState(false);
    const [visible, setVisible] = useState(true);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.project.developerProject,
                getById: apiConfig.project.getById,
            },
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
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

                funcs.additionalActionColumnButtons = () => ({
                    // member: ({ id, name, status }) => (
                    //     <BaseTooltip title={translate.formatMessage(commonMessage.member)}>
                    //         <Button
                    //             type="link"
                    //             style={{ padding: '0' }}
                    //             // disabled={status === -1}
                    //             onClick={(e) => {
                    //                 e.stopPropagation();
                    //                 if (status == 1) {
                    //                     navigate(
                    //                         routes.projectMemberListPage.path +
                    //                             `?projectId=${id}&projectName=${name}&active=${true}`,
                    //                     );
                    //                 } else {
                    //                     navigate(
                    //                         routes.projectMemberListPage.path + `?projectId=${id}&projectName=${name}`,
                    //                     );
                    //                 }
                    //             }}
                    //         >
                    //             <UserOutlined />
                    //         </Button>
                    //     </BaseTooltip>
                    // ),
                    // team: ({ id, name, status, leaderInfo }) => (
                    //     <BaseTooltip title={translate.formatMessage(commonMessage.team)}>
                    //         <Button
                    //             type="link"
                    //             style={{ padding: '0' }}
                    //             onClick={(e) => {
                    //                 e.stopPropagation();
                    //                 const pathDefault = `?projectId=${id}&projectName=${name}`;
                    //                 let path;
                    //                 if (leaderName) {
                    //                     path =
                    //                         routes.learderProjectTeamListPage.path +
                    //                         pathDefault +
                    //                         `&leaderId=${leaderInfo.id}&leaderName=${leaderName}`;
                    //                 } else if (developerName) {
                    //                     path =
                    //                         routes.developerProjectTeamListPage.path +
                    //                         pathDefault +
                    //                         `&developerId=${developerId}&developerName=${developerName}`;
                    //                 } else {
                    //                     if (status == 1) {
                    //                         path = routes.teamListPage.path + pathDefault + `&active=${true}`;
                    //                     } else path = routes.teamListPage.path + pathDefault;
                    //                 }
                    //                 navigate(path);
                    //             }}
                    //         >
                    //             <IconBrandTeams color="#2e85ff" size={17} style={{ marginBottom: '-2px' }} />
                    //         </Button>
                    //     </BaseTooltip>
                    // ),
                    // projectCategory: ({ id, name }) => (
                    //     <BaseTooltip title={translate.formatMessage(commonMessage.projectCategory)}>
                    //         <Button
                    //             type="link"
                    //             style={{ padding: '0' }}
                    //             onClick={(e) => {
                    //                 e.stopPropagation();
                    //                 const pathDefault = `?projectId=${id}&projectName=${name}`;
                    //                 navigate(routes.projectCategoryListPage.path + pathDefault);
                    //             }}
                    //         >
                    //             <IconCategory size={16} />
                    //         </Button>
                    //     </BaseTooltip>
                    // ),
                });

                funcs.changeFilter = (filter) => {
                    const leaderId = queryParams.get('leaderId');
                    const leaderName = queryParams.get('leaderName');
                    const developerId = queryParams.get('developerId');
                    const developerName = queryParams.get('developerName');
                    if (leaderId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ leaderId: leaderId, leaderName: leaderName, ...filter }),
                        );
                    } else if (developerId) {
                        mixinFuncs.setQueryParams(
                            serializeParams({ developerId: developerId, developerName: developerName, ...filter }),
                        );
                    } else {
                        mixinFuncs.setQueryParams(serializeParams(filter));
                    }
                };
            },
        });

    const setBreadRoutes = () => {
        const breadRoutes = [];
        breadRoutes.push({ breadcrumbName: translate.formatMessage(commonMessage.project) });

        return breadRoutes;
    };
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.projectName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
       
    ].filter(Boolean);
    const handleOnClick = (event, record) => {
        event.preventDefault();
        localStorage.setItem(routes.projectTabPage.keyActiveTab, translate.formatMessage(commonMessage.task));
        navigate(
            routes.developerProjectTabPage.path +
                `?projectId=${record.id}&projectName=${record.name}&active=${!!record.status == 1}`,
        );
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 80,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.projectName),
            dataIndex: 'name',
            width: 300,
            render: (name, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {name}
                </div>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.leader),
            dataIndex: ['leader', 'account', 'fullName'],
            width: 400,
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 300,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'endDate',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 300,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 300,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
    ].filter(Boolean);
    return (
        <PageWrapper routes={setBreadRoutes()}>
            <ListPage
                title={<span style={{ fontWeight: 'normal' }}>{leaderName || developerName}</span>}
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    className: styles.search,
                })}
                baseTable={
                    <BaseTable
                        onChange={changePagination}
                        pagination={pagination}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                }
            />
            {hasError && (
                <Modal
                    title={
                        <span>
                            <ExclamationCircleOutlined style={{ color: 'red' }} /> Lỗi
                        </span>
                    }
                    open={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                >
                    <p>Chưa có thành viên nào trong dự án, vui lòng kiểm tra lại</p>
                </Modal>
            )}
        </PageWrapper>
    );
};

export default DeveloperProjectListPage;
