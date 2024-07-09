import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DATE_FORMAT_DISPLAY, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { candidateState, jobState } from '@constants/masterData';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Tag, Button, Modal } from 'antd';
import React from 'react';
import routes from '../routes';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { DownloadOutlined, CheckOutlined } from '@ant-design/icons';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
const CandidateListPage = () => {
    const translate = useTranslate();
    const queryParameters = new URLSearchParams(window.location.search);
    const jobName = queryParameters.get('jobName');
    const jobId = queryParameters.get('jobId');
    const stateValues = translate.formatKeys(candidateState, ['label']);
    const notification = useNotification();
    const { execute: executeChangeState } = useFetch(apiConfig.candidate.changeState, { immediate: false });
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: {
            getList: apiConfig.candidate.getList,
            getById: apiConfig.candidate.getById,
            create: apiConfig.candidate.create,
            update: apiConfig.candidate.update,
        },
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(commonMessage.candidate),
        },
        override: (funcs) => {
            funcs.getCreateLink = () => {
                return `${routes.candidateListPage.path}/create?jobId=${jobId}&jobName=${jobName}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${routes.candidateListPage.path}/${dataRow.id}?jobId=${jobId}&jobName=${jobName}`;
            };
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
                download: ({ fileCV }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.downloadCv)}>
                        <a target="_blank" rel="noreferrer" href={AppConstants.contentRootUrl + fileCV}>
                            <DownloadOutlined color="yellow" />
                        </a>
                    </BaseTooltip>
                ),
                state: ({ id }) => {
                    const handleChangeState = (id) => {
                        Modal.confirm({
                            title: translate.formatMessage(commonMessage.changeStateCandidateConfirm),
                            content: '',
                            okText: translate.formatMessage(commonMessage.ok),
                            cancelText: translate.formatMessage(commonMessage.cancel),
                            onOk: () => {
                                executeChangeState({
                                    data: {
                                        candidateId: id,
                                        state: 1,
                                    },
                                    onCompleted: (response) => {
                                        if (response.result === true) {
                                            mixinFuncs.getList();
                                            notification({
                                                message: translate.formatMessage(
                                                    commonMessage.changeStateCandidateSuccess,
                                                ),
                                            });
                                        }
                                    },
                                    onError: (err) => {
                                        notification({
                                            message: translate.formatMessage(commonMessage.changeStateCandidateError),
                                        });
                                    },
                                });
                            },
                        });
                    };
                    return (
                        <BaseTooltip title={translate.formatMessage(commonMessage.accept)}>
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeState(id);
                                }}
                            >
                                <CheckOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });
    const breadRoutes = [
        { breadcrumbName: translate.formatMessage(commonMessage.job), path: routes.jobListPage.path },
        { breadcrumbName: translate.formatMessage(commonMessage.candidate) },
    ];
    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.candidateName),
        },
    ];
    const convertDate = (date) => {
        const dateConvert = convertStringToDateTime(date, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY);
        return convertDateTimeToString(dateConvert, DATE_FORMAT_DISPLAY);
    };
    const columns = [
        {
            title: translate.formatMessage(commonMessage.candidateName),
            dataIndex: 'name',
            width: 300,
        },
        {
            title: translate.formatMessage(commonMessage.createdDate),
            dataIndex: 'createdDate',
            render: (createdDate) => {
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{convertDate(createdDate)}</div>;
            },
            width: 140,
            align: 'center',
        },
        {
            title: translate.formatMessage(commonMessage.skill),
            dataIndex: 'skill',
            align: 'center',
            width: 240,
        },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: 'email',
            align: 'center',
            width: 240,
        },
        {
            title: translate.formatMessage(commonMessage.address),
            dataIndex: 'address',
            align: 'center',
            width: 300,
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
        mixinFuncs.renderActionColumn({ download: true, state: true, edit: true, delete: true }, { width: '200px' }),
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
export default CandidateListPage;
