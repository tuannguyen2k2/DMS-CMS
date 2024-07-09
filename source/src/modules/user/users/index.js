import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar, Button } from 'antd';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { FieldTypes } from '@constants/formConfig';
import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DATE_FORMAT_VALUE, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { FormattedMessage, defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import AvatarField from '@components/common/form/AvatarField';
import { commonMessage } from '@locales/intl';
import useAuth from '@hooks/useAuth';
import { convertUtcToLocalTime, formatMoney } from '@utils/index';
import { statusOptions } from '@constants/masterData';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@routes';
import { HomeOutlined } from '@ant-design/icons';

const UserListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    // const { isCustomer } = useAuth();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.user,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: ['account', 'avatar'],
            align: 'center',
            width: 100,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: translate.formatMessage(commonMessage.fullName), dataIndex: ['account', 'fullName'] },
        { title: translate.formatMessage(commonMessage.phone), dataIndex: ['account', 'phone'], width: '130px' },
        {
            title: translate.formatMessage(commonMessage.birthday),
            dataIndex: 'birthday',
            align: 'center',
            render: (birthday) => {
                const result = convertUtcToLocalTime(birthday, DEFAULT_FORMAT, DATE_FORMAT_VALUE);
                return <div>{result}</div>;
            },
            width: '120px',
        },
        {
            title: <FormattedMessage defaultMessage="Lương cố định" />,
            dataIndex: 'salary',
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

        { title: translate.formatMessage(commonMessage.email), dataIndex: ['account', 'email'] },
        // {
        //     title: translate.formatMessage(commonMessage.createdDate),
        //     dataIndex: 'createdDate',
        //     width: '180px',
        //     render: (createdDate) => convertUtcToTimezone(createdDate),
        // },
        // mixinFuncs.renderStatusColumn({ width: '90px' }),
        {
            title: translate.formatMessage(commonMessage.userGroup),
            align: 'center',
            dataIndex: ['account', 'group', 'name'],
            width: '180px',
        },
        {
            title: translate.formatMessage(commonMessage.folderPermissionGroup),
            dataIndex: 'documentGroup',
            width: '180px',
            align: 'center',
            render: (documentGroup) => {
                let groupDuplicateName;
                return documentGroup.map((group) => {
                    if (group && groupDuplicateName != group?.name) {
                        groupDuplicateName = group?.name;
                        return <div key={group?.id}>{group?.name}</div>;
                    }
                });
            },
        },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '120px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.fullName),
        },
        // {
        //     key: 'status',
        //     placeholder: translate.formatMessage(commonMessage.status),
        //     type: FieldTypes.SELECT,
        //     options: statusValues,
        // },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default UserListPage;
