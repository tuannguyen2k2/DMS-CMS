import { CalendarOutlined, CheckOutlined, FireOutlined, RetweetOutlined } from '@ant-design/icons';
import { BaseForm } from '@components/common/form/BaseForm';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import NumericField from '@components/common/form/NumericField';
import TextField from '@components/common/form/TextField';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import {
    DATE_FORMAT_DISPLAY,
    DATE_FORMAT_END_OF_DAY_TIME,
    DATE_FORMAT_ZERO_TIME,
    DEFAULT_FORMAT,
    DEFAULT_TABLE_ITEM_SIZE,
} from '@constants';
import apiConfig from '@constants/apiConfig';
import { FieldTypes } from '@constants/formConfig';
import { projectTaskState } from '@constants/masterData';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { convertUtcToLocalTime, deleteSearchFilterInLocationSearch, formatDateString } from '@utils';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Button, Col, Form, Modal, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import bug from '../../../assets/images/bug.jpg';
import feature from '../../../assets/images/feature.png';
import styles from '../project.module.scss';
import DetailProjectTaskModal from './DetailProjectTaskModal';
import PageWrapper from '@components/common/layout/PageWrapper';
import useBasicForm from '@hooks/useBasicForm';
import useAuth from '@hooks/useAuth';

const message = defineMessages({
    objectName: 'Task',
    cancel: 'Huỷ',
    done: 'Hoàn thành',
    waitingTaskSuccess: 'Task đã chuyển sang trạng thái chờ duyệt!',
    doneTaskSuccess: 'Đã hoàn thành task!',
    acceptTaskSuccess: 'Đã nhận task!',
    fixChangeStateSuccess: 'Đã chỉnh sửa nội dung review!',
    updateTaskError: 'Cập nhật thất bại!',
});

function ProjectTaskListPage({ setBreadCrumbName, renderAction, createPermission }) {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const notification = useNotification({ duration: 3 });
    const intl = useIntl();
    const search = useMemo(() => {
        return location.search;
    }, []);
    const { pathname: pagePath, state } = useLocation();
    console.log(state);
    // const { openModal } = state;
    const queryParameters = new URLSearchParams(window.location.search);
    const storyId = queryParameters.get('storyId');
    const projectId = queryParameters.get('projectId');
    const projectName = queryParameters.get('projectName');
    const storyName = queryParameters.get('storyName');
    const active = queryParameters.get('active');
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const activeProjectTab = localStorage.getItem('activeProjectTab');
    localStorage.setItem('pathPrev', location.search);
    const [openedModal, handlersModal] = useDisclosure(false);
    const [detail, setDetail] = useState({});
    const [openAcceptHours, setOpenAcceptHours] = useState(false);
    const [openedStateTaskModal, handlersStateTaskModal] = useDisclosure(false);
    const { profile, isAdmin } = useAuth();
    const [estAgree, setEstAgree] = useState(false);
    const { execute: executeGet } = useFetch(apiConfig.projectTask.getById, {
        immediate: false,
    });
    const [openSubmitTask, setOpenSubmitTask] = useState(false);
    useEffect( () => {
        if(state?.openModal){
            handleFetchDetail(state?.projectTaskId);
            handlersModal.open();
        }  
        
    },[state]);
    const handleSubmitTask = () => {
        executeUpdate({
            data: {
                id: detail.id,
                state: 5,
                estAgree,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    mixinFuncs.getList();
                    notification({
                        message: intl.formatMessage(message.doneTaskSuccess),
                    });
                    setEstAgree(false);
                    setOpenSubmitTask(false);
                }
            },
            onError: (err) => {
                notification({
                    type: 'error',
                    message: intl.formatMessage(message.updateTaskError),
                });
            },
        });
    };
    const handleFetchDetail = (id) => {
        executeGet({
            pathParams: { id: id },
            onCompleted: (response) => {
                setDetail(response.data);
            },
            onError: mixinFuncs.handleGetDetailError,
        });
    };
    const { execute: executeUpdate } = useFetch(apiConfig.projectTask.changeState, { immediate: false });

    const handleOk = (values) => {
        handlersStateTaskModal.close();
        updateState(values);
    };
    const updateState = (values) => {
        executeUpdate({
            data: {
                id: detail.id,
                state: 3,
                minutes: values.minutes,
                message: values.message,
                gitCommitUrl: values.gitCommitUrl,
                estReason: values.estReason,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    handlersStateTaskModal.close();
                    mixinFuncs.getList();
                    notification({
                        message: intl.formatMessage(
                            detail.state === 3 ? message.fixChangeStateSuccess : message.waitingTaskSuccess,
                        ),
                    });
                }
            },
            onError: (err) => {
                notification({
                    type: 'error',
                    message: intl.formatMessage(message.updateTaskError),
                });
            },
        });
    };
    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination, queryParams, serializeParams } =
        useListBase({
            apiConfig: apiConfig.projectTask,
            options: {
                pageSize: DEFAULT_TABLE_ITEM_SIZE,
                objectName: translate.formatMessage(commonMessage.task),
            },
            tabOptions: {
                queryPage: {
                    storyId,
                },
                isTab: true,
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
                funcs.getCreateLink = () => {
                    return `${pagePath}/create?projectId=${projectId}&storyId=${storyId}&projectName=${projectName}&storyName=${storyName}&active=${active}`;
                };
                funcs.getItemDetailLink = (dataRow) => {
                    return `${pagePath}/${dataRow.id}?projectId=${projectId}&storyId=${storyId}&projectName=${projectName}&storyName=${storyName}&active=${active}`;
                };
                funcs.additionalActionColumnButtons = () => ({
                    state: (item) => {
                        if (pagePath.includes('leader-project') || isAdmin()) {
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.done)}>
                                    <Button
                                        type="link"
                                        disabled={item.state !== 3}
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (item.estReason) {
                                                setOpenAcceptHours(true);
                                            } else {
                                                setOpenSubmitTask(true);
                                            }
                                            setDetail(item);
                                        }}
                                    >
                                        <CheckOutlined />
                                    </Button>
                                </BaseTooltip>
                            );
                        }
                        if (profile?.id === item.developer.id && item.state == 2) {
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.waitingDone)}>
                                    <Button
                                        type="link"
                                        disabled={!!item?.developer == false || item.state === 3}
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDetail(item);
                                            handlersStateTaskModal.open();
                                        }}
                                    >
                                        <CheckOutlined />
                                    </Button>
                                </BaseTooltip>
                            );
                        } else if (profile?.id === item.developer.id && item.state == 1) {
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.acceptTask)}>
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            executeUpdate({
                                                data: {
                                                    id: item.id,
                                                    state: 2,
                                                },
                                                onCompleted: (response) => {
                                                    if (response.result === true) {
                                                        handlersStateTaskModal.close();
                                                        mixinFuncs.getList();
                                                        notification({
                                                            message: intl.formatMessage(message.acceptTaskSuccess),
                                                        });
                                                    }
                                                },
                                                onError: (err) => {
                                                    notification({
                                                        type: 'error',
                                                        message: intl.formatMessage(message.updateTaskError),
                                                    });
                                                },
                                            });
                                        }}
                                    >
                                        <FireOutlined />
                                    </Button>
                                </BaseTooltip>
                            );
                        } else if (profile?.id === item.developer.id && item.state == 3) {
                            return (
                                <BaseTooltip title={translate.formatMessage(commonMessage.fixChangeState)}>
                                    <Button
                                        type="link"
                                        style={{ padding: 0 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDetail(item);
                                            handlersStateTaskModal.open();
                                        }}
                                    >
                                        <RetweetOutlined />
                                    </Button>
                                </BaseTooltip>
                            );
                        }
                    },
                });
                const handleFilterSearchChange = funcs.handleFilterSearchChange;
                funcs.handleFilterSearchChange = (values) => {
                    if (values.toDate == null && values.fromDate == null) {
                        delete values.toDate;
                        delete values.fromDate;
                        handleFilterSearchChange({
                            ...values,
                        });
                    } else if (values.toDate == null) {
                        const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                        delete values.toDate;
                        handleFilterSearchChange({
                            ...values,
                            fromDate: fromDate,
                        });
                    } else if (values.fromDate == null) {
                        const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                        delete values.fromDate;
                        handleFilterSearchChange({
                            ...values,
                            toDate: toDate,
                        });
                    } else {
                        const fromDate = values.fromDate && formatDateToZeroTime(values.fromDate);
                        const toDate = values.toDate && formatDateToEndOfDayTime(values.toDate);
                        handleFilterSearchChange({
                            ...values,
                            fromDate: fromDate,
                            toDate: toDate,
                        });
                    }
                };
            },
        });

    const columns = [
        {
            dataIndex: 'kind',
            width: 15,
            render(dataRow) {
                if (dataRow === 1)
                    return (
                        <div>
                            <img src={feature} height="30px" width="30px" />
                        </div>
                    );
                if (dataRow === 2)
                    return (
                        <div>
                            <img src={bug} height="30px" width="30px" />
                        </div>
                    );
            },
        },
        {
            title: translate.formatMessage(commonMessage.task),
            width: 200,
            dataIndex: 'taskName',
        },
        {
            title: translate.formatMessage(commonMessage.developer),
            dataIndex: ['developer', 'account', 'fullName'],
            width: 200,
            // render: (_, record) => record?.developer?.studentInfo?.fullName || record?.leader?.leaderName,
        },
        {
            title: translate.formatMessage(commonMessage.startDate),
            dataIndex: 'startDate',
            width: 200,
            align: 'center',
            render: (startDate) => {
                const modifiedDateComplete = convertStringToDateTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT)?.add(
                    7,
                    'hour',
                );
                const modifiedDateCompleteTimeString = convertDateTimeToString(modifiedDateComplete, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateCompleteTimeString}</div>;
            },
        },
        {
            title: 'Thời gian dự kiến hoàn thành',
            dataIndex: 'estimateTime',
            width: 200,
            align: 'center',
            render: (estimateTime) => {
                if (estimateTime) {
                    return <div>{estimateTime} giờ</div>;
                }
                return null;
            },
        },
        {
            title: translate.formatMessage(commonMessage.dateComplete),
            dataIndex: 'dateComplete',
            width: 180,
            render: (dateComplete) => {
                const modifiedDateComplete = convertStringToDateTime(dateComplete, DEFAULT_FORMAT, DEFAULT_FORMAT)?.add(
                    7,
                    'hour',
                );
                const modifiedDateCompleteTimeString = convertDateTimeToString(modifiedDateComplete, DEFAULT_FORMAT);
                return <div style={{ padding: '0 4px', fontSize: 14 }}>{modifiedDateCompleteTimeString}</div>;
            },
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

        mixinFuncs.renderActionColumn(
            {
                taskLog: true,
                state: true,
                edit: !pagePath.includes('developer-project'),
                delete: !pagePath.includes('developer-project'),
            },
            { width: '180px' },
        ),
    ].filter(Boolean);

    const { data: memberProject } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params: { projectId: projectId },
        mappingData: ({ data }) =>
            data.content.map((item) => ({
                value: item?.developer?.id,
                label: item?.developer?.account?.fullName,
            })),
    });

    const searchFields = [
        {
            key: 'userId',
            placeholder: <FormattedMessage defaultMessage={'Lập trình viên'} />,
            type: FieldTypes.SELECT,
            options: memberProject,
            colSpan: 5,
        },
        {
            key: 'state',
            placeholder: translate.formatMessage(commonMessage.state),
            type: FieldTypes.SELECT,
            options: stateValues,
        },
        {
            key: 'fromDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.fromDate),
            colSpan: 3,
        },
        {
            key: 'toDate',
            type: FieldTypes.DATE,
            format: DATE_FORMAT_DISPLAY,
            placeholder: translate.formatMessage(commonMessage.toDate),
            colSpan: 3,
        },
    ].filter(Boolean);
    const initialFilterValues = useMemo(() => {
        const initialFilterValues = {
            ...queryFilter,
            fromDate: queryFilter.fromDate && dayjs(formatDateToLocal(queryFilter.fromDate), DEFAULT_FORMAT),
            toDate:
                queryFilter.toDate && dayjs(formatDateToLocal(queryFilter.toDate), DEFAULT_FORMAT).subtract(7, 'hour'),
        };

        return initialFilterValues;
    }, [queryFilter?.fromDate, queryFilter?.toDate]);
    const paramHead = routes.projectListPage.path;

    const pathTab = () => {
        if (pagePath.includes(routes.projectTaskListPage.path)) {
            return routes.projectTabPage.path;
        } else if (pagePath.includes(routes.developerProjectTaskListPage.path)) {
            return routes.developerProjectTabPage.path;
        } else if (pagePath.includes(routes.leaderProjectTaskListPage.path)) {
            return routes.leaderProjectTabPage.path;
        }
    };
    const pathProject = () => {
        if (pagePath.includes(routes.projectTaskListPage.path)) {
            return routes.projectListPage.path;
        } else if (pagePath.includes(routes.developerProjectTaskListPage.path)) {
            return routes.developerProjectListPage.path;
        } else if (pagePath.includes(routes.leaderProjectTaskListPage.path)) {
            return routes.leaderProjectListPage.path;
        }
    };
    const [form] = Form.useForm();

    useEffect(() => {
        console.log(detail);
        form.setFieldsValue({ ...detail });
    }, [openedStateTaskModal]);

    function calculateHours(startDate) {
        const now = dayjs();
        const start = dayjs(startDate, 'DD/MM/YYYY HH:mm:ss').add(7, 'hour');
        const diff = now.diff(start, 'hour');
        return diff;
    }
    return (
        <PageWrapper
            routes={
                setBreadCrumbName
                    ? setBreadCrumbName(['fromDate', 'toDate'])
                    : routes.projectTaskListPage.breadcrumbs(
                        commonMessage,
                        pathProject(),
                        pathTab(),
                        deleteSearchFilterInLocationSearch(search, ['fromDate', 'toDate']),
                        true,
                    )
            }
        >
            <div>
                <ListPage
                    searchForm={mixinFuncs.renderSearchForm({
                        fields: searchFields,
                        className: styles.search,
                        activeTab: activeProjectTab,
                    })}
                    actionBar={!pagePath.includes('developer-project') && mixinFuncs.renderActionBar()}
                    baseTable={
                        <BaseTable
                            onRow={(record) => ({
                                onClick: (e) => {
                                    e.stopPropagation();
                                    handleFetchDetail(record.id);

                                    handlersModal.open();
                                },
                            })}
                            onChange={changePagination}
                            pagination={pagination}
                            loading={loading}
                            style={{
                                cursor: 'pointer',
                            }}
                            dataSource={data}
                            columns={columns}
                        />
                    }
                />
                <Modal
                    title={translate.formatMessage(commonMessage.titleTaskDone)}
                    open={openedStateTaskModal}
                    destroyOnClose={true}
                    footer={null}
                    onCancel={() => handlersStateTaskModal.close()}
                    data={detail || {}}
                >
                    <BaseForm onFinish={handleOk} form={form} size="100%">
                        <div
                            style={{
                                margin: '28px 0 20px 0',
                            }}
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <TextField
                                        label={<FormattedMessage defaultMessage="Đường dẫn commit git" />}
                                        name="gitCommitUrl"
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <TextField
                                        label={<FormattedMessage defaultMessage="Lời nhắn" />}
                                        name="message"
                                        type="textarea"
                                    />
                                </Col>
                            </Row>
                            <div>Thời gian bạn hoàn thành: {calculateHours(detail.startDate)} giờ</div>
                            <div>Thời gian dự kiến hoàn thành: {detail.estimateTime} giờ</div>
                            {calculateHours(detail.startDate) > detail.estimateTime && (
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <TextField
                                            label={
                                                <FormattedMessage defaultMessage="Lý do bạn không hoàn thành task đúng thời hạn" />
                                            }
                                            name="estReason"
                                            type="textarea"
                                        />
                                    </Col>
                                </Row>
                            )}
                            <div style={{ float: 'right' }}>
                                <Button className={styles.btnModal} onClick={() => handlersStateTaskModal.close()}>
                                    {translate.formatMessage(message.cancel)}
                                </Button>
                                <Button key="submit" type="primary" htmlType="submit" style={{ marginLeft: '8px' }}>
                                    {translate.formatMessage(message.done)}
                                </Button>
                            </div>
                        </div>
                    </BaseForm>
                </Modal>
                <Modal
                    title="Xác nhận hoàn thành task"
                    open={openSubmitTask}
                    onOk={handleSubmitTask}
                    onCancel={() => setOpenSubmitTask(false)}
                >
                    <p>{'Bạn có chắc chắn muốn hoàn thành task này ?'}</p>
                </Modal>
                <Modal
                    title="Xác nhận thời gian hoàn thành vượt quá thời gian dự kiến"
                    open={openAcceptHours}
                    onOk={() => {
                        setOpenSubmitTask(true);
                        setEstAgree(true);
                        setOpenAcceptHours(false);
                    }}
                    okText={'Đồng ý'}
                    cancelText={'Không đồng ý'}
                    onCancel={() => {
                        setOpenSubmitTask(true);
                        setOpenAcceptHours(false);
                    }}
                >
                    <p>
                        <div>Thời gian hoàn thành: {calculateHours(detail.startDate)} giờ</div>
                        <div>Thời gian dự kiến hoàn thành: {detail.estimateTime} giờ</div>
                        <div>Lý do: {detail.estReason}</div>
                    </p>
                </Modal>
                <DetailProjectTaskModal open={openedModal} onCancel={() => handlersModal.close()} DetailData={detail} />
            </div>
        </PageWrapper>
    );
}
const formatDateToZeroTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_ZERO_TIME);
};
const formatDateToEndOfDayTime = (date) => {
    const dateString = formatDateString(date, DEFAULT_FORMAT);
    return dayjs(dateString, DEFAULT_FORMAT).format(DATE_FORMAT_END_OF_DAY_TIME);
};

const formatDateToLocal = (date) => {
    return convertUtcToLocalTime(date, DEFAULT_FORMAT, DEFAULT_FORMAT);
};
export default ProjectTaskListPage;
