import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import DatePickerField from '@components/common/form/DatePickerField';
import RichTextField, { insertBaseURL, removeBaseURL } from '@components/common/form/RichTextField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import { memberTaskKind, projectTaskKind, projectTaskState, statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { formatDateString } from '@utils';
import { Card, Col, Form, Radio, Row, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const LeaderProjectTaskForm = (props) => {
    const { formId, actions, onSubmit, dataDetail, setIsChangedFormValues, isEditing } = props;
    const translate = useTranslate();
    const stateValues = translate.formatKeys(projectTaskState, ['label']);
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    // const kindValues = translate.formatKeys(projectTaskKind, ['label']);
    const queryParameters = new URLSearchParams(window.location.search);
    const projectId = queryParameters.get('projectId');
    const [valueSelect, setValueSelect] = useState(1);
    const [memKind, setMemKind] = useState(1);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const handleSubmit = (values) => {
        values.startDate = values.startDate && formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = values.dueDate && formatDateString(values.dueDate, DEFAULT_FORMAT);
        if (typeof values.developerId === 'string') {
            values.developerId = dataDetail?.developer?.studentInfo?.id;
        }
        if (typeof values.projectCategoryId === 'string') {
            values.projectCategoryId = dataDetail?.projectCategoryInfo?.id;
        }
        if (typeof values.leaderId === 'string') {
            values.leaderId = dataDetail?.leader?.id;
        }
        return mixinFuncs.handleSubmit({ ...values, description: removeBaseURL(values?.description) });
    };
    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
                state: stateValues[0].value,
                kind: projectTaskKind[0].value,
                memKind: valueSelect,
            });
        }
    }, [isEditing]);
    const {
        data: developers,
        loading: getdevelopersLoading,
        execute: executesdevelopers,
    } = useFetch(apiConfig.memberProject.autocomplete, {
        params: { projectId: projectId },
        immediate: true,
        mappingData: ({ data }) =>
            data.content.map((item) => ({ value: item.id, label: item.developer.account.fullName })),
    });

    // const {
    //     data: team,
    //     loading: getTeamLoading,
    //     execute: executesTeams,
    // } = useFetch(apiConfig.team.autocomplete, {
    //     params: { projectId: projectId },
    //     immediate: true,
    //     mappingData: ({ data }) =>
    //         data.content.map((item) => ({ value: item?.leaderInfo?.id, label: item?.leaderInfo?.leaderName })),
    // });
    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);
        let value;

        if (dataDetail?.startDate && dataDetail?.leader) {
            setValueSelect(2);
            value = 2;
        } else {
            value = 1;
        }

        form.setFieldsValue({
            ...dataDetail,
            projectCategoryId: dataDetail?.projectCategoryInfo?.projectCategoryName,
            developerId: dataDetail?.developer?.account?.fullName,
            leaderId: dataDetail?.leader?.leaderName,
            description: insertBaseURL(dataDetail?.description),
            memKind: value,
        });
    }, [dataDetail]);

    const validateDueDate = (_, value) => {
        const { startDate } = form.getFieldValue();
        if (startDate && value && value.isBefore(startDate)) {
            return Promise.reject('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
        return Promise.resolve();
    };

    const validateStartDate = (_, value) => {
        const date = dayjs(formatDateString(new Date(), DEFAULT_FORMAT), DATE_FORMAT_VALUE);
        if (date && value && value.isBefore(date) && !isEditing) {
            return Promise.reject('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại');
        }
        return Promise.resolve();
    };

    const handleOnSelect = (value) => {
        setValueSelect(value);
    };

    // useEffect(() => {
    //     if (valueSelect == 2) {
    //         executesTeams();
    //     } else {
    //         executesdevelopers();
    //     }
    // }, [valueSelect]);

    return (
        <BaseForm formId={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Space>{<FormattedMessage defaultMessage="Tên task" />}</Space>
                            <Space.Compact align="start">
                                <SelectField
                                    style={{
                                        width: '80px',
                                        height: '31.8px',
                                    }}
                                    // label={<FormattedMessage defaultMessage="Tên Task" />}
                                    name="kind"
                                    allowClear={false}
                                    options={projectTaskKind}
                                />
                                <TextField
                                    style={{
                                        width: '288px',
                                    }}
                                    name="taskName"
                                    required
                                />
                            </Space.Compact>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical">
                            <Space>{<FormattedMessage defaultMessage="Người thực hiện" />}</Space>
                            <Space.Compact align="start">
                                <SelectField
                                    disabled={isEditing}
                                    style={{
                                        width: '90px',
                                    }}
                                    // label={<FormattedMessage defaultMessage="Người thực hiện" />}
                                    name="memKind"
                                    allowClear={false}
                                    options={memberTaskKind}
                                    onSelect={handleOnSelect}
                                    required
                                />
                                <AutoCompleteField
                                    disabled={isEditing}
                                    style={{
                                        width: '278px',
                                    }}
                                    // label={<FormattedMessage defaultMessage=" " />}
                                    name="developerId"
                                    apiConfig={apiConfig.memberProject.autocomplete}
                                    mappingOptions={(item) => ({
                                        value: item.developer.id,
                                        label: item.developer.account.fullName,
                                    })}
                                    searchParams={(text) => ({ fullName: text })}
                                    optionsParams={{ projectId: projectId }}
                                    initialSearchParams={{ projectId: projectId }}
                                    // required
                                />
                            </Space.Compact>
                        </Space>
                    </Col>
                    {/* <Col span={12}>
                        <AutoCompleteField
                            required
                            label={<FormattedMessage defaultMessage="Danh mục" />}
                            name="projectCategoryId"
                            apiConfig={apiConfig.projectCategory.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.id,
                                label: item.projectCategoryName,
                            })}
                            searchParams={(text) => ({ name: text })}
                            optionsParams={{ projectId: projectId }}
                            initialSearchParams={{ projectId: projectId }}
                        />
                    </Col> */}
                    <Col span={12}>
                        <SelectField
                            required
                            name="state"
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            allowClear={false}
                            options={stateValues}
                        />
                    </Col>

                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            name="startDate"
                            placeholder="Ngày bắt đầu"
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            showTime={true}
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="dueDate"
                            placeholder="Ngày kết thúc"
                            rules={[
                                {
                                    validator: validateDueDate,
                                },
                            ]}
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <RichTextField
                    label={<FormattedMessage defaultMessage="Mô tả" />}
                    labelAlign="left"
                    name="description"
                    style={{
                        height: 300,
                        marginBottom: 70,
                    }}
                    required
                    baseURL={AppConstants.contentRootUrl}
                    setIsChangedFormValues={setIsChangedFormValues}
                    form={form}
                />

                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LeaderProjectTaskForm;
