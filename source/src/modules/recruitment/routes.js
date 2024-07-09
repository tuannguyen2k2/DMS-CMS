import apiConfig from '@constants/apiConfig';

import CandidateListPage from './candidate';
import CandidateSavePage from './candidate/CandidateSavePage';
import JobListPage from './job';
import JobSavePage from './job/JobSavePage';

export default {
    jobListPage: {
        path: '/job',
        title: 'Job',
        auth: true,
        component: JobListPage,
        permissions: [apiConfig.job.getList.baseURL],
    },
    jobSavePage: {
        path: '/job/:id',
        title: 'Job Save Page',
        auth: true,
        component: JobSavePage,
        permissions: [apiConfig.job.create.baseURL, apiConfig.job.update.baseURL],
    },
    candidateListPage: {
        path: '/job/candidate',
        title: 'Candidate',
        auth: true,
        component: CandidateListPage,
        permissions: [apiConfig.job.getList.baseURL],
    },
    candidateSavePage: {
        path: '/job/candidate/:id',
        title: 'Candidate Save Page',
        auth: true,
        component: CandidateSavePage,
        permissions: [apiConfig.candidate.create.baseURL, apiConfig.candidate.update.baseURL],
    },
};
