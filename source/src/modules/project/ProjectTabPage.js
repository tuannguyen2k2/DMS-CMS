import React, { useState } from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import useQueryParams from '@hooks/useQueryParams';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Tabs } from 'antd';
import ProjectTaskListPage from './projectTask';
import ProjectMemberListPage from './member';
import ProjectStoryListPage from './projectStory';
import { useLocation } from 'react-router-dom';

const ProjectTabPage = () => {
    const translate = useTranslate();
    const { params: queryParams } = useQueryParams();
    const projectName = queryParams.get('projectName');
    const [searchFilter, setSearchFilter] = useState([]);
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.projectTabPage.keyActiveTab)
            ? localStorage.getItem(routes.projectTabPage.keyActiveTab)
            : translate.formatMessage(commonMessage.feature),
    );
    const dataTab = [
        {
            label: translate.formatMessage(commonMessage.feature),
            key: translate.formatMessage(commonMessage.task),
            children: <ProjectStoryListPage />,
        },
        {
            label: translate.formatMessage(commonMessage.member),
            key: translate.formatMessage(commonMessage.member),
            children: <ProjectMemberListPage setSearchFilter={setSearchFilter} />,
        },
    ];
    const { pathname: pagePath } = useLocation();
    const pathProject = () => {
        if (pagePath.includes(routes.developerProjectListPage.path)) {
            return routes.developerProjectListPage.path;
        } else if (pagePath.includes(routes.leaderProjectListPage.path)) {
            return routes.leaderProjectListPage.path;
        }
        else if (pagePath.includes(routes.projectListPage.path)) {
            return routes.projectListPage.path;
        }
    };
    const breadcrumbs = [
        {
            breadcrumbName: translate.formatMessage(commonMessage.project),
            path: pathProject(),
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
                            localStorage.setItem(routes.projectTabPage.keyActiveTab, key);
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

export default ProjectTabPage;
