import React from 'react';
import { Tooltip } from 'antd';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const messages = defineMessages({
    edit: `Edit {objectName}`,
    delete: `Delete {objectName}`,
    view: `View {objectName}`,
});

export const BaseTooltip = ({
    placement = 'bottom',
    type,
    objectName = '',
    title,
    toLowerCase = true,
    children,
    ...props
}) => {
    const translate = useTranslate();
    if (toLowerCase) {
        objectName = objectName.toLowerCase();
    }
    const titleMapping = {
        edit: translate.formatMessage(messages.edit, { objectName }),
        delete:  translate.formatMessage(messages.delete, { objectName }),
        view: translate.formatMessage(messages.view, { objectName }),
    };

    title = titleMapping[type] || title;
    return (
        <Tooltip placement={placement} title={title} {...props}>
            {children}
        </Tooltip>
    );
};
