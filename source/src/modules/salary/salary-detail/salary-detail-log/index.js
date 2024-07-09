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
import routes from '@routes';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import { FormattedMessage } from 'react-intl';
import { formatMoney } from '@utils';
import AvatarField from '@components/common/form/AvatarField';
import { UserOutlined } from '@ant-design/icons';
// import styles from './job.module.scss';
const SalaryPeriodDetailLogListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const salaryPeriodId = queryParameters.get('salaryPeriodId');
    const salaryPeriodName = queryParameters.get('salaryPeriodName');
    const developerName = queryParameters.get('developerName');
    const stateValues = translate.formatKeys(SalaryPeriodState, ['label']);
    const { execute: executeUpdate } = useFetch(apiConfig.salaryPeriod.approve, { immediate: false });
    const notification = useNotification({ duration: 3 });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.salaryPeriodDetailLog,
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
            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                delete params.salaryPeriodId;
                return {
                    ...prepareGetListParams(params),
                };
            };
        },
    });
    const breadRoutes = [
        developerName && {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriodList),
            path: routes.salaryPeriodListPage.path,
        },
        developerName && {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriodName),
            path:
                routes.salaryPeriodDetailListPage.path +
                `?salaryPeriodId=${salaryPeriodId}&salaryPeriodName=${salaryPeriodName}`,
        },
        !developerName && {
            breadcrumbName: translate.formatMessage(commonMessage.mySalary),
            path: routes.mySalaryListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.salaryPeriodDetail),
        },
    ].filter(Boolean);
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
            title: 'Loại lương',
            dataIndex: 'kind',
            align: 'left',
            width: 200,
            render: (kind) => {
                if (kind == 1) {
                    return <div>Lương cố định</div>;
                } else {
                    return <div>Lương theo dự án</div>;
                }
            },
        },
        {
            title: 'Lương',
            dataIndex: 'devFixedSalary',
            width: 120,
            render: (devFixedSalary, record) => {
                if (record.devFixedSalary) {
                    return <div>{devFixedSalary} $</div>;
                } else {
                    return <div>{record.devHourlySalary} $</div>;
                }
            },
        },
        {
            title: <FormattedMessage defaultMessage="Lương nhận được" />,
            dataIndex: 'money',
            width: 200,
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
            title: <FormattedMessage defaultMessage="Dự án" />,
            dataIndex: 'projectName',
            width: 210,
            align: 'center',
        },

        {
            title: <FormattedMessage defaultMessage="Task" />,
            dataIndex: 'taskName',
            align: 'center',
        },

        mixinFuncs.renderActionColumn({ state: false, edit: true, delete: false }, { width: '120px' }),
    ];
    return (
        <PageWrapper routes={breadRoutes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ initialValues: queryFilter })}
                title={
                    <span
                        style={{
                            fontWeight: 'normal',
                            fontSize: '16px',
                        }}
                    >
                        {salaryPeriodName} {developerName && '-'} {developerName}
                    </span>
                }
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: (e) => {
                                e.stopPropagation();
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
export default SalaryPeriodDetailLogListPage;
