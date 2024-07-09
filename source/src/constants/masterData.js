import {
    STATUS_ACTIVE,
    STATUS_INACTIVE,
    STATUS_PENDING,
    PROVINCE_KIND,
    DISTRICT_KIND,
    VILLAGE_KIND,
    STATE_PROJECT_TASK_CREATE,
    STATE_PROJECT_TASK_PROCESSING,
    STATE_PROJECT_TASK_DONE,
    STATE_PROJECT_TASK_CANCEL,
    projectTaskStateMessage,
    TASK_KIND_FEATURE,
    TASK_KIND_BUG,
    TASK_KIND_DEV,
    TASK_KIND_LEADER,
    stateResgistrationMessage,
    dayOfWeek,
    jobStateMessage,
    candidateStateMessage,
    salaryPeriodMessage,
    STATE_PROJECT_TASK_WAITING,
} from '@constants';
import { defineMessages } from 'react-intl';
import { documentKindMessage, documentPermissionKindMessage, nationKindMessage } from './intl';
import React from 'react';
import feature from '../assets/images/feature.png';
import bug from '../assets/images/bug.jpg';

const commonMessage = defineMessages({
    statusActive: 'Active',
    statusPending: 'Pending',
    statusInactive: 'Inactive',
});
export const TASK_LOG_WORKING = 1;
export const TASK_LOG_OFF = 100;

export const taskLog = defineMessages({
    working: 'Làm việc',
    off: 'Nghỉ phép',
});

export const TaskLogKindOptions = [
    {
        value: TASK_LOG_WORKING,
        label: taskLog.working,
        color: 'green',
    },
    {
        value: TASK_LOG_OFF,
        label: taskLog.off,
        color: 'red',
    },
];

export const daysOfWeekSchedule = [
    { value: 'monday', label: dayOfWeek.monday },
    { value: 'tuesday', label: dayOfWeek.tuesday },
    { value: 'wednesday', label: dayOfWeek.wednesday },
    { value: 'thursday', label: dayOfWeek.thursday },
    { value: 'friday', label: dayOfWeek.friday },
    { value: 'saturday', label: dayOfWeek.saturday },
    { value: 'sunday', label: dayOfWeek.sunday },
];

export const stateResgistrationOptions = [
    {
        value: 1,
        label: stateResgistrationMessage.register,
        color: 'yellow',
    },
    { value: 2, label: stateResgistrationMessage.learning, color: 'blue' },
    { value: 3, label: stateResgistrationMessage.finished, color: 'green' },
    { value: 4, label: stateResgistrationMessage.canceled, color: 'red' },
];

export const projectTaskKind = [
    {
        value: TASK_KIND_FEATURE,
        label: (
            <div>
                <img src={feature} height="20px" width="20px" style={{ marginTop: '10px', marginLeft: '5px' }} />
            </div>
        ),
    },
    {
        value: TASK_KIND_BUG,
        label: (
            <div>
                <img src={bug} height="20px" width="20px" style={{ marginTop: '10px', marginLeft: '5px' }} />
            </div>
        ),
    },
];

export const memberTaskKind = [
    {
        value: TASK_KIND_DEV,
        label: 'Dev',
    },
    {
        value: TASK_KIND_LEADER,
        label: 'Leader',
    },
];

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Active', color: 'green' },
    { value: STATUS_PENDING, label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE, label: 'Inactive', color: 'red' },
];

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const projectTaskState = [
    { value: STATE_PROJECT_TASK_CREATE, label: projectTaskStateMessage.create, color: 'yellow' },
    { value: STATE_PROJECT_TASK_PROCESSING, label: projectTaskStateMessage.processing, color: 'blue' },
    { value: STATE_PROJECT_TASK_DONE, label: projectTaskStateMessage.done, color: 'green' },
    { value: STATE_PROJECT_TASK_CANCEL, label: projectTaskStateMessage.cancel, color: 'red' },
    { value: STATE_PROJECT_TASK_WAITING, label: projectTaskStateMessage.waiting, color: 'purple' },
];

export const candidateState = [
    { value: 1, label: candidateStateMessage.accept, color: 'green' },
    { value: 2, label: candidateStateMessage.pending, color: 'orange' },
    { value: 3, label: candidateStateMessage.reject, color: 'red' },
];


export const jobState = [
    { value: 1, label: jobStateMessage.open, color: 'green' },
    { value: 2, label: jobStateMessage.close, color: 'red' },
];

export const SalaryPeriodState = [
    { value: 2, label: salaryPeriodMessage.accept, color: 'green' },
    { value: 1, label: salaryPeriodMessage.process, color: 'purple' },
];

export const nationKindOptions = [
    {
        value: PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: VILLAGE_KIND,
        label: nationKindMessage.village,
    },
];
export const documentKindOptions = [
    {
        value: 1,
        label: documentKindMessage.folder,
    },
    {
        value: 2,
        label: documentKindMessage.file,
    },
];
export const documentPermissionKindOptions = [
    {
        value: 1,
        label: documentPermissionKindMessage.read,
    },
    {
        value: 2,
        label: documentPermissionKindMessage.write,
    },
    {
        value: 3,
        label: documentPermissionKindMessage.delete,
    },
];
