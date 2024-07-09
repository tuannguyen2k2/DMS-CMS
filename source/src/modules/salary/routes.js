import apiConfig from '@constants/apiConfig';
import SalaryPeriodListPage from '.';
import MySalaryListPage from './my-salary';
import SalaryPeriodDetailListPage from './salary-detail';
import SalaryPeriodDetailLogListPage from './salary-detail/salary-detail-log';

export default {
    salaryPeriodListPage: {
        path: '/salary-period',
        title: 'Salary',
        auth: true,
        component: SalaryPeriodListPage,
        permissions: [apiConfig.salaryPeriod.getList.baseURL],
    },
    salaryPeriodDetailListPage: {
        path: '/salary-period/detail',
        title: 'Salary',
        auth: true,
        component: SalaryPeriodDetailListPage,
        permissions: [apiConfig.salaryPeriodDetail.getList.baseURL],
    },
    mySalaryListPage: {
        path: '/my-salary',
        title: 'Salary',
        auth: true,
        component: MySalaryListPage,
        permissions: [apiConfig.salaryPeriodDetail.mySalary.baseURL],
    },
    mySalaryLogListPage: {
        path: '/my-salary/log',
        title: 'Salary',
        auth: true,
        component: SalaryPeriodDetailLogListPage,
        permissions: [apiConfig.salaryPeriodDetailLog.getList.baseURL],
    },
    salaryPeriodDetailLogListPage: {
        path: '/salary-period/detail/log',
        title: 'Salary',
        auth: true,
        component: SalaryPeriodDetailLogListPage,
        permissions: [apiConfig.salaryPeriodDetailLog.getList.baseURL],
    },
};
