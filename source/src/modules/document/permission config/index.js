import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useState } from 'react';
import BaseTable from '@components/common/table/BaseTable';

import { DEFAULT_TABLE_ITEM_SIZE, isSystemSettingOptions } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import useAuth from '@hooks/useAuth';
import SelectField from '@components/common/form/SelectField';
import { Tabs } from 'antd';

const message = defineMessages({
    objectName: 'setting',
});
const DocumentPermissionConfigListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem('activePermissionConfigTab') ? localStorage.getItem('activePermissionConfigTab') : 'group',
    );
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.memberDocument,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareGetListParams = (params) => {
                return {
                    ...params,
                };
            };
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    const setting = {
                        user: {
                            total: 0,
                            data: [],
                        },
                        group: {
                            total: 0,
                            data: [],
                        },
                    };

                    response?.data?.content?.forEach((item) => {
                        if ('user' in item) {
                            setting.user.total++;
                            setting.user.data.push(item);
                        } else if ('group' in item) {
                            setting.group.total++;
                            setting.group.data.push(item);
                        }
                    });
                    return {
                        data: setting,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });
    const columns = [
        {
            title:
                activeTab == 'user'
                    ? translate.formatMessage(commonMessage.account)
                    : translate.formatMessage(commonMessage.userGroup),
            dataIndex: activeTab == 'user' ? ['user', 'account', 'fullName'] : ['group', 'name'],
        },
        {
            title: translate.formatMessage(commonMessage.folderPermissionGroup),
            dataIndex: ['documentGroup', 'name'],
        },
        mixinFuncs.renderActionColumn({ delete: true }, { width: '130px' }),
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        onTabClick={(key) => {
                            setActiveTab(key);
                            localStorage.setItem('activePermissionConfigTab', key);
                        }}
                        activeKey={activeTab}
                        items={Object.keys(data).map((item) => {
                            return {
                                label:
                                    item == 'user'
                                        ? translate.formatMessage(commonMessage.account)
                                        : translate.formatMessage(commonMessage.userGroup),
                                key: item,
                                children: (
                                    <BaseTable
                                        columns={columns}
                                        dataSource={data[item].data}
                                        pagination={{
                                            pageSize: DEFAULT_TABLE_ITEM_SIZE,
                                            total: data[item].total,
                                        }}
                                        loading={loading}
                                    />
                                ),
                            };
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DocumentPermissionConfigListPage;
