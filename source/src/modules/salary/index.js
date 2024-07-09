import { CheckOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { SalaryPeriodState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import routes from './routes';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
// import styles from './job.module.scss';
const SalaryPeriodListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const stateValues = translate.formatKeys(SalaryPeriodState, ['label']);
    const { execute: executeUpdate } = useFetch(apiConfig.salaryPeriod.approve, { immediate: false });
    const notification = useNotification({ duration: 3 });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.salaryPeriod,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(commonMessage.salaryPeriodName),
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
            funcs.additionalActionColumnButtons = () => ({
                state: (item) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.acceptSalaryPeriod)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            disabled={item.state === 2}
                            onClick={(e) => {
                                e.stopPropagation();
                                executeUpdate({
                                    data: {
                                        id: item.id,
                                    },
                                    onCompleted: (response) => {
                                        if (response.result === true) {
                                            mixinFuncs.getList();
                                            notification({
                                                message: translate.formatMessage(commonMessage.acceptSalarySuccess),
                                            });
                                        }
                                    },
                                    onError: (err) => {
                                        notification({
                                            type: 'error',
                                            message: translate.formatMessage(commonMessage.acceptSalaryError),
                                        });
                                    },
                                });
                            }}
                        >
                            <CheckOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });
    console.log(pagination);
    const breadRoutes = [{ breadcrumbName: translate.formatMessage(commonMessage.salaryPeriodList) }];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.salaryPeriodName),
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
    ];
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };
    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(routes.candidateListPage.path + `?jobId=${record.id}&jobName=${record.name}`);
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.salaryPeriodName),
            dataIndex: 'name',
            // render: (name, record) => (
            //     <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
            //         {name}
            //     </div>
            // ),
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'start',
            render: (startDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(startDate)}</div>;
            },
            width: 240,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.endDate),
            dataIndex: 'end',
            render: (endDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(endDate)}</div>;
            },
            width: 240,
            align: 'center',
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
        mixinFuncs.renderActionColumn({ state: true, edit: true, delete: true }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.salaryPeriodDetailListPage.path +
                                        `?salaryPeriodId=${record.id}&salaryPeriodName=${record.name}`,
                                );
                            },
                        })}
                        style={{
                            cursor: 'pointer',
                        }}
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
export default SalaryPeriodListPage;
