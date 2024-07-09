import { CheckOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
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
import routes from '../routes';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import { FormattedMessage } from 'react-intl';
import { formatMoney } from '@utils';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined } from '@ant-design/icons';
// import styles from './job.module.scss';
const MySalaryLogListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const salaryPeriodName = queryParameters.get('salaryPeriodName');
    const stateValues = translate.formatKeys(SalaryPeriodState, ['label']);
    const { execute: executeUpdate } = useFetch(apiConfig.salaryPeriod.approve, { immediate: false });
    const notification = useNotification({ duration: 3 });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: {
                getList: apiConfig.salaryPeriodDetail.mySalary,
            },
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
                funcs.changeFilter = (filter) => {
                    const salaryPeriodId = queryParams.get('salaryPeriodId');
                    mixinFuncs.setQueryParams(serializeParams({ salaryPeriodId, salaryPeriodName, ...filter }));
                };
            },
        });
    const breadRoutes = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.mySalary),
        },
    ];
    const { data: member } = useFetch(apiConfig.user.autocomplete, {
        immediate: true,
        params: { salaryPeriodId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.id,
                label: item?.fullName,
            })),
    });

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
            dataIndex: ['salaryPeriod','name'],
            // render: (name, record) => (
            //     <div onClick={(event) => handleOnClick(event, record)} className={styles.customDiv}>
            //         {name}
            //     </div>
            // ),
        },
        {
            title: <FormattedMessage defaultMessage="Lương cố định" />,
            dataIndex: 'fixSalary',
            width: 250,
            align: 'center',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: '$',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Lương thưởng dự án" />,
            dataIndex: 'hourlySalary',
            width: 250,
            align: 'center',
            render: (price) => {
                const formattedValue = formatMoney(price, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: '$',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tổng lương nhận được" />,
            width: 250,
            align: 'center',
            render: (_, record) => {
                const formattedValue = formatMoney(record.fixSalary + record.hourlySalary, {
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currentcy: '$',
                    currentDecimal: '0',
                });
                return <div>{formattedValue}</div>;
            },
        },

        {
            title: <FormattedMessage defaultMessage="Tổng giờ làm việc" />,
            dataIndex: 'totalTimeWorking',
            width: 250,
            align: 'center',
            render: (totalTimeWorking) => {
                return <div>{totalTimeWorking} giờ</div>;
            },
        },

        mixinFuncs.renderActionColumn({ state: false, edit: true, delete: false }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                title={
                    <span
                        style={{
                            fontWeight: 'normal',
                            fontSize: '16px',
                        }}
                    >
                        {salaryPeriodName}
                    </span>
                }
                searchForm={mixinFuncs.renderSearchForm({  initialValues: queryFilter })}
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.mySalaryLogListPage.path +
                                        `?salaryPeriodName=${record.salaryPeriod.name}&salaryPeriodDetailId=${record.id}`,
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
export default MySalaryLogListPage;
