import React, { useState } from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import useQueryParams from '@hooks/useQueryParams';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Tabs } from 'antd';
import ProjectMemberListPage from '../member';
import DeveloperProjectTaskListPage from './projectTask';

const DeveloperProjectTabPage = () => {
    const translate = useTranslate();
    const { params: queryParams } = useQueryParams();
    const projectName = queryParams.get('projectName');
    const [searchFilter, setSearchFilter] = useState([]);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.developerProjectTabPage.keyActiveTab)
            ? localStorage.getItem(routes.developerProjectTabPage.keyActiveTab)
            : translate.formatMessage(commonMessage.task),
    );
    const dataTab = [
        {
            label: translate.formatMessage(commonMessage.task),
            key: translate.formatMessage(commonMessage.task),
            children: <DeveloperProjectTaskListPage setSearchFilter={setSearchFilter} />,
        },
        // {
        //     label: translate.formatMessage(commonMessage.team),
        //     key: translate.formatMessage(commonMessage.team),
        //     // children: <TeamListPage setSearchFilter={setSearchFilter} />,
        // },
        {
            label: translate.formatMessage(commonMessage.member),
            key: translate.formatMessage(commonMessage.member),
            children: <ProjectMemberListPage setSearchFilter={setSearchFilter} />,
        },
    ];

    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: routes.developerProjectListPage.path,
        },
        {
            breadcrumbName: translate.formatMessage(commonMessage.generalManage),
        },
    ];

    return (
        <PageWrapper routes={breadcrumbs}>
            <ListPage
                title={<div style={{ fontWeight: 'normal' }}>{projectName}</div>}
                baseTable={
                    <Tabs
                        style={{ marginTop: 20 }}
                        type="card"
                        onTabClick={(key) => {
                            setActiveTab(key);
                            localStorage.setItem(routes.developerProjectTabPage.keyActiveTab, key);
                        }}
                        activeKey={activeTab}
                        items={dataTab.map((item) => {
                            return {
                                label: item.label,
                                key: item.key,
                                children: item.children,
                            };
                        })}
                    />
                }
            />
        </PageWrapper>
    );
};

export default DeveloperProjectTabPage;
