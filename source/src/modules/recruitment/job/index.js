import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { jobState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../routes';
import styles from './job.module.scss';
const JobListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(jobState, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.job.getList,
            getById: apiConfig.job.getById,
            create: apiConfig.job.create,
            update: apiConfig.job.update,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(commonMessage.job),
        },
        override: (funcs) => {
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
        },
    });
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.job) }];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.jobName),
        },
    ];
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(
            routes.candidateListPage.path +
                `?jobId=${record.id}&jobName=${record.name}`,
        );
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.jobName),
            dataIndex: 'name',
            render: (name, record) => (
                <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
                    {name}
                </div>
            ),
        },
        // {
        //     title: translate.formatMessage(commonMessage.startDate),
        //     dataIndex: 'startDate',
        //     render: (startDate) => {
        //         return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
        //     },
        //     width: 140,
        //     align: 'center',
        // },
        // {
        //     title: translate.formatMessage(commonMessage.modifiedDate),
        //     dataIndex: 'endDate',
        //     render: (endDate) => {
        //         return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
        //     },
        //     width: 140,
        //     align: 'center',
        // },
        {
            title: translate.formatMessage(commonMessage.skill),
            dataIndex: 'skill',
        },
        {
            title: translate.formatMessage(commonMessage.state),
            dataIndex: 'state',
            align: 'center',
            width: 120,
            render(dataRow) {
                const state = stateValues.find((item) => item.value == dataRow);
                return (
                    <Tag color={state.color}>
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{state.label}</div>
                    </Tag>
                );
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
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
        </PageWrapper>
    );
};
export default JobListPage;
