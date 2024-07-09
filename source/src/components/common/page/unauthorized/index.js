import { NotAllowedIcon } from '@assets/icons';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { IconAlertTriangleFilled, IconArrowNarrowRight } from '@tabler/icons-react';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';


const PageUnauthorized = () => {
    const translate = useTranslate();
    return (
        <div style={{ fontSize: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NotAllowedIcon />
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <p>
                    <FormattedMessage key="message" defaultMessage="Sorry, You Are Not Allowed To Access This Page" />
                </p>
                <IconAlertTriangleFilled style={{ color: 'red', marginLeft: '4px' }} />
            </span>
            <Link to={routes.homePage.path} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <span>{translate.formatMessage(commonMessage.backHomePage)}</span>
                <IconArrowNarrowRight style={{ marginLeft: '2px' }} />
            </Link>
        </div>
    );
};

export default PageUnauthorized;
