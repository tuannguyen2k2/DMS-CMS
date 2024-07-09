import { UserOutlined } from '@ant-design/icons';
import ScheduleFile from '@components/common/elements/ScheduleFile';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Avatar } from 'antd';
import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './member.module.scss';
import useAuth from '@hooks/useAuth';

const message = defineMessages({
    objectName: 'Thành viên',
    role: 'Vai trò',
    name: 'Họ và tên ',
    developer: 'Lập trình viên',
    member: 'Thành viên',
    team: 'Nhóm',
});

const ProjectMemberListPage = ({ setSearchFilter }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const active = queryParameters.get('active');
    const { profile } = useAuth();
    localStorage.setItem('pathPrev', location.search);
    let { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.memberProject,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(message.objectName),
            },
            tabOptions: {
                queryPage: {
                    projectId,
                },
                isTab: true,
            },
            override: (funcs) => {
                const pathDefault = `?projectId=${projectId}&projectName=${projectName}`;
                funcs.mappingData = (response) => {
                    try {
                        if (response.result === true) {
                            return {
                                data: response.data.content,
                                total: response.data.totalElements,
                            };
                        }
                    } catch (error) {
                        return [];
                    }
                };
                funcs.getCreateLink = () => {
                    return `${routes.projectMemberListPage.path}/create?projectId=${projectId}&projectName=${projectName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    if (active)
                        return `${routes.projectMemberListPage.path}/${dataRow.id}` + pathDefault + `&active=${active}`;
                    else return `${routes.projectMemberListPage.path}/${dataRow.id}` + pathDefault;
                };
            },
        });

    useEffect(() => {
        setSearchFilter(queryFilter);
    }, [queryFilter]);
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.memberActivityProjectListPage.path +
                `?projectId=${record?.project?.id}&studentId=${record?.developer.studentInfo?.id}&studentName=${record?.developer.studentInfo?.fullName}`,
        );
    };

    const columns = [
        {
            title: '#',
            dataIndex: ['developer', 'studentInfo', 'avatar'],
            align: 'center',
            width: 80,
            render: (avatar) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: translate.formatMessage(commonMessage.name),
            dataIndex: ['developer', 'account', 'fullName'],
        },
        {
            title: translate.formatMessage(commonMessage.role),
            dataIndex: ['projectRole', 'projectRoleName'],
            width: 350,
        },

        {
            title: translate.formatMessage(commonMessage.schedule),
            dataIndex: 'schedule',
            align: 'start',
            render: (schedule) => {
                return <ScheduleFile schedule={schedule} />;
            },
            width: 280,
        },

        active &&
            mixinFuncs.renderActionColumn(
                {
                    edit: true,
                    delete: true,
                },
                { width: '150px' },
            ),
    ].filter(Boolean);
    // const { data: teamData } = useFetch(apiConfig.team.autocomplete, {
    //     immediate: true,
    //     params: { projectId },
    //     mappingData: ({ data }) => data.content.map((item) => ({ value: item.id, label: item.teamName })),
    // });
    // const searchFields = [
    //     {
    //         key: 'teamId',
    //         placeholder: translate.formatMessage(commonMessage.team),
    //         type: FieldTypes.SELECT,
    //         options: teamData,
    //     },
    // ];

    return (
        <ListPage
            // searchForm={mixinFuncs.renderSearchForm({
            //     fields: searchFields,
            //     className: styles.search,
            //     activeTab: activeProjectTab,
            // })}
            actionBar={ profile.isSuperAdmin && mixinFuncs.renderActionBar()}
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
    );
};

export default ProjectMemberListPage;
