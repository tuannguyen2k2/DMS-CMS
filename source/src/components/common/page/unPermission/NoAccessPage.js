import { UnPermissionIcon } from '@assets/icons';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { IconAlertTriangleFilled, IconArrowNarrowRight } from '@tabler/icons-react';
import React from 'react';
import { defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

const messages = defineMessages({
    notice: 'You are not authorized to access this document. Please contact the administrator.',
});

export const NoAccessPage = () => {
    const translate = useTranslate();
    return (
        <div
            style={{
                fontSize: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '80px',
            }}
        >
            <UnPermissionIcon />
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <p>{translate.formatMessage(messages.notice)}</p>
                <IconAlertTriangleFilled style={{ color: 'red', marginLeft: '4px' }} />
            </span>

            <Link to={routes.homePage.path} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span>{translate.formatMessage(commonMessage.backHomePage)}</span>
                <IconArrowNarrowRight style={{ marginLeft: '2px' }} />
            </Link>
        </div>
    );
};

export default NoAccessPage;
