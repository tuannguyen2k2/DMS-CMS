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
import { AppConstants } from '@constants';
import { commonMessage } from '@locales/intl';

const DetailProjectStoryModal = ({ open, onCancel, DetailData, ...props }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            ...DetailData,
            description: insertBaseURL(DetailData?.description),
        });
    }, [DetailData]);
    const handleOnCancel = () => {
        onCancel();
    };
    return (
        <Modal
            centered
            open={open}
            onCancel={handleOnCancel}
            width={800}
            footer={[]}
            title={"Chi tiết tính năng dự án"}
        >
            <>
                <BaseForm form={form} style={{ width: '100%' }}>
                    <Card className="card-form" bordered={false}>
                        <TextField
                            readOnly
                            label={<FormattedMessage defaultMessage="Tên tính năng" />}
                            name={['storyName']}
               
                        />
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
            </>
        </Modal>
    );
};

export default DetailProjectStoryModal;
