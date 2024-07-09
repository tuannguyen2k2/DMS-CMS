import { defineMessages } from 'react-intl';

export const apiUrl = process.env.REACT_APP_API;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';

export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

export const brandName = 'Corporate Hub';

export const appName = 'cms-app';

export const storageKeys = {
    USER_KIND: `${appName}-user-kind`,
    USER_ACCESS_TOKEN: `${appName}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-user-refresh-token`,
};

export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    contentRootUrl: `${process.env.REACT_APP_API_MEDIA}v1/file/download`,
    mediaRootUrl: `${process.env.REACT_APP_API_MEDIA}`,
    langKey: 'vi',
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'en';
export const locales = ['en', 'vi'];

export const activityType = {
    GAME: 'game',
    VIDEO: 'video',
    ARTICLE: 'article',
    FOCUS_AREA: 'focus-area',
};

export const dayOfWeek = defineMessages({
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật',
});

export const stateResgistrationMessage = defineMessages({
    register: 'Đăng ký',
    learning: 'Đang học',
    finished: 'Đã hoành thành',
    canceled: 'Đã huỷ',
});
export const TASK_KIND_FEATURE = 1;
export const TASK_KIND_BUG = 2;

export const TASK_KIND_DEV = 1;
export const TASK_KIND_LEADER = 2;

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DATE_FORMAT_ZERO_TIME = 'DD/MM/YYYY 00:00:00';
export const DATE_FORMAT_END_OF_DAY_TIME = 'DD/MM/YYYY 23:59:59';

export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const articleTypeEnum = {
    URL: 'url',
    PLAIN: 'plain',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LIMIT_IMAGE_SIZE = 512000;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;

export const DEFAULT_TABLE_ITEM_SIZE = 10;
export const DEFAULT_TABLE_PAGE_START = 0;

export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    INACTIVE: -1,
    DELETE: -2,
};

export const UserTypes = {
    ADMIN: 1,
    CUSTOMER: 2,
    EMPLOYEE: 3,
};

export const commonStatusColor = {
    [commonStatus.PENDING]: 'warning',
    [commonStatus.ACTIVE]: 'green',
    [commonStatus.INACTIVE]: 'red',
};

export const ADMIN_LOGIN_TYPE = 'password';
export const USER_LOGIN_TYPE = 'user';

export const loginOptions = [
    { label: 'Admin', value: ADMIN_LOGIN_TYPE },
    { label: 'Thành viên', value: USER_LOGIN_TYPE },
];

export const categoryKind = {
    news: 1,
};

export const appAccount = {
    APP_USERNAME: process.env.REACT_APP_USERNAME,
    APP_PASSWORD: process.env.REACT_APP_PASSWORD,
};

export const GROUP_KIND_ADMIN = 1;
export const GROUP_KIND_MANAGER = 2;
export const GROUP_KIND_USER = 3;

export const groupPermissionKindsOptions = [
    { label: 'Admin', value: GROUP_KIND_ADMIN },
    { label: 'User', value: GROUP_KIND_USER },
];

export const isSystemSettingOptions = [
    { label: 'Hiển thị cài đặt hệ thống', value: 1 },
    { label: 'Ẩn cài đặt hệ thống', value: 0 },
];

export const PROVINCE_KIND = 1;
export const DISTRICT_KIND = 2;
export const VILLAGE_KIND = 3;

export const STATE_PROJECT_TASK_CREATE = 1;
export const STATE_PROJECT_TASK_PROCESSING = 2;
export const STATE_PROJECT_TASK_WAITING = 3;
export const STATE_PROJECT_TASK_DONE = 5;
export const STATE_PROJECT_TASK_CANCEL = 4;

export const projectTaskStateMessage = defineMessages({
    create: 'Chờ xử lý',
    processing: 'Đang xử lý',
    done: 'Hoàn tất',
    cancel: 'Đã hủy',
    waiting: 'Chờ duyệt',
});
export const jobStateMessage = defineMessages({
    open: 'Mở ứng tuyển',
    close: 'Đóng ứng tuyển',
});

export const CurrentcyPositions = {
    FRONT: 0,
    BACK: 1,
};

export const salaryPeriodMessage = defineMessages({
    accept: 'Đã duyệt',
    process: 'Chờ duyệt',
});

export const candidateStateMessage = defineMessages({
    accept: 'Chấp nhận',
    pending: 'Chờ xét duyệt',
    reject: 'Từ chối',
});
