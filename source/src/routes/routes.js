import React, { useEffect } from 'react';

import { Routes, BrowserRouter, Route } from 'react-router-dom';

import ValidateAccess from './ValidateAccess';
import AppNavigate from '@modules/main/AppNavigate';

import routes from '.';
import useAuth from '@hooks/useAuth';
import Loading from '@components/common/loading';
import { getCacheAccessToken } from '@services/userService';
import { webSocket } from '@utils/webSocket';
import useTranslate from '@hooks/useTranslate';

const routesArray = Object.values(routes);

const AppRoutes = () => {
    const translate = useTranslate();
    const { isAuthenticated, loading: loadingProfile, profile } = useAuth();
    useEffect(() => {
        const accessToken = getCacheAccessToken();
        webSocket(accessToken, translate);
    }, []);
    const renderRoute = (route) => {
        return (
            <Route
                key={route.path || 'not-found'}
                path={route.path}
                index={route.index}
                element={
                    loadingProfile ? (
                        <Loading show />
                    ) : (
                        <ValidateAccess
                            permissions={route.permission}
                            separate={route.separateCheck}
                            onValidatePermissions={route.validatePermissions}
                            authRequire={route.auth}
                            component={route.component}
                            componentProps={route.componentProps}
                            isAuthenticated={isAuthenticated}
                            profile={profile}
                            layout={route.layout}
                            path={route.path}
                            pageOptions={route.pageOptions}
                        />
                    )
                }
            />
        );
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppNavigate />}>{routesArray.map(renderRoute)}</Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
