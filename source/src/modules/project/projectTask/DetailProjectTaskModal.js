import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import SelectField from '@components/common/form/SelectField';
import { statusOptions, projectTaskState } from '@constants/masterData';
import RichTextField, { insertBaseURL } from '@components/common/form/RichTextField';
import { AppConstants, DEFAULT_FORMAT } from '@constants';
import { commonMessage } from '@locales/intl';
import dayjs from 'dayjs';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
const messages = defineMessages({
    objectName: 'Chi tiết task của dự án',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const DetailProjectTaskModal = ({ open, onCancel, DetailData, ...props }) => {
    const [form] = Form.useForm();

    const notification = useNotification();

    const translate = useTranslate();

    const projectTaskStateValues = translate.formatKeys(projectTaskState, ['label']);

    useEffect(() => {
        // form.setFields(data);
        if (DetailData.startDate && open) {
            const modifiedDateComplete = convertStringToDateTime(
                DetailData.startDate,
                DEFAULT_FORMAT,
                DEFAULT_FORMAT,
            )?.add(7, 'hour');
            DetailData.startDate = convertDateTimeToString(modifiedDateComplete, DEFAULT_FORMAT);
        }
        if (DetailData.dateComplete && open) {
            const modifiedDateComplete = convertStringToDateTime(
                DetailData.dateComplete,
                DEFAULT_FORMAT,
                DEFAULT_FORMAT,
            )?.add(7, 'hour');
            DetailData.dateComplete =DetailData.dateComplete && convertDateTimeToString(modifiedDateComplete, DEFAULT_FORMAT);
        }

        // DetailData.startDate = DetailData.startDate && dayjs(DetailData.startDate).add(7, 'hour');
        // DetailData.startDate = DetailData.startDate && dayjs(DetailData.startDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...DetailData,
            developer: {
                ...DetailData?.developer,
                studentInfo: {
                    ...DetailData?.developer?.studentInfo,
                    fullName: DetailData?.developer?.studentInfo?.fullName || '',
                },
            },
            leader: {
                ...DetailData?.leader,
                leaderName: DetailData?.leader?.leaderName || '',
            },
            startDate: DetailData?.startDate || '',
            dueDate: DetailData?.dueDate || '',
            description: insertBaseURL(DetailData?.description),
        });
    }, [DetailData]);
    const handleOnCancel = () => {
        onCancel();
    };
    const handleOnClickReview = (url) => {
        const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
        if (pattern.test(url)) {
            window.open(url, '_blank');
        } else {
            notification({
                type: 'warning',
                message: translate.formatMessage(commonMessage.warningUrl),
            });
        }
    };
    return (
        <Modal
            centered
            open={open}
            onCancel={handleOnCancel}
            width={800}
            footer={[]}
            title={translate.formatMessage(messages.objectName)}
        >
            <>
                <BaseForm form={form} style={{ width: '100%' }}>
                    <Card className="card-form" bordered={false}>
                        <Row gutter={12}>
                            <Col span={12}>
                                <TextField
                                    readOnly
                                    label={<FormattedMessage defaultMessage="Tên task" />}
                                    name={['taskName']}
                                    // initialValue={detail.name}
                                />
                            </Col>
                            {DetailData?.leader ? (
                                <Col span={12}>
                                    <TextField
                                        readOnly
                                        label={<FormattedMessage defaultMessage="Leader" />}
                                        name={['leader', 'leaderName']}
                                        // initialValue={detail.name}
                                    />
                                </Col>
                            ) : (
                                <Col span={12}>
                                    <TextField
                                        readOnly
                                        label={<FormattedMessage defaultMessage="Lập trình viên" />}
                                        name={['developer', 'account', 'fullName']}
                                        // initialValue={detail.name}
                                    />
                                </Col>
                            )}
                        </Row>
                        <Row gutter={12}>
                            {DetailData.startDate && (
                                <Col span={12}>
                                    <TextField
                                        readOnly
                                        label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                        name="startDate"
                                        // initialValue={detail.name}
                                    />
                                </Col>
                            )}

                            {DetailData.dateComplete && (
                                <Col span={12}>
                                    <TextField
                                        readOnly
                                        label={<FormattedMessage defaultMessage="Ngày hoàn thành" />}
                                        name="dateComplete"
                                        // initialValue={detail?.subject?.subjectName}
                                    />
                                </Col>
                            )}
                        </Row>
                        <Row gutter={12}>
                            <Col span={12}>
                                <SelectField
                                    readOnly
                                    label={<FormattedMessage defaultMessage="Tình Trạng" />}
                                    name="state"
                                    options={projectTaskStateValues}
                                    disabled
                                    // initialValue={detail?.subject?.subjectName}
                                />
                            </Col>
                        </Row>

                        <RichTextField
                            label={<FormattedMessage defaultMessage="Mô tả" />}
                            disabled={true}
                            labelAlign="left"
                            name="description"
                            style={{
                                height: 300,
                                marginBottom: 70,
                            }}
                            baseURL={AppConstants.contentRootUrl}
                            form={form}
                        />
                    </Card>
                </BaseForm>
                {DetailData.state === 3 && (
                    <Card style={{ marginTop: '20px' }}>
                        <Typography style={{ fontSize: '16px', fontWeight: 600 }}>Review task</Typography>
                        <Typography style={{ fontSize: '14px', fontWeight: 500, marginTop: '10px' }}>
                            Đường dẫn review :{' '}
                            <a onClick={() => handleOnClickReview(DetailData?.gitCommitUrl)}>
                                {DetailData?.gitCommitUrl}
                            </a>
                        </Typography>
                        <Typography style={{ fontSize: '14px', fontWeight: 500, marginTop: '10px' }}>
                            Lời nhắn : {DetailData?.message}
                        </Typography>
                    </Card>
                )}
            </>
        </Modal>
    );
};

export default DetailProjectTaskModal;
