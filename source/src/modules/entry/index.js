import { UserTypes, storageKeys } from '@constants';
import routes from '@routes';
import { getData } from '@utils/localStorage';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const userKind = getData(storageKeys.USER_KIND);
    if (userKind == UserTypes.ADMIN) {
        return <Navigate to={routes.adminsListPage.path} />;
    } else if (userKind == UserTypes.EMPLOYEE) {
        return <Navigate to={routes.developerProjectListPage.path} />;
    }
    return null;
};

export default Dashboard;
