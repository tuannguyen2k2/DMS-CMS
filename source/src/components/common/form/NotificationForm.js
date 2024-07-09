import { DEFAULT_FORMAT, UserTypes } from '@constants';
import apiConfig from '@constants/apiConfig';
import useAuth from '@hooks/useAuth';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { IconBell, IconBellFilled, IconCheck, IconCircleCheck, IconCircleX, IconInfoCircle } from '@tabler/icons-react';
import HeadlessTippy from '@tippyjs/react/headless';
import { convertDateTimeToString, convertStringToDateTime } from '@utils/dayHelper';
import { Badge, Button, Card, Modal, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { BaseTooltip } from './BaseTooltip';
import styles from './NotificationForm.module.scss';
import { LiaCalendarPlusSolid } from 'react-icons/lia';
import { LuCalendarCheck2 } from 'react-icons/lu';
import { LiaSearchSolid } from 'react-icons/lia';
import { IoRocketOutline } from 'react-icons/io5';
import { RxUpdate } from 'react-icons/rx';
const messages = defineMessages({
    doneTaskDescription: 'Bạn đã hoàn thành task: ',
    studentNewTaskDescription: 'Bạn đã được giao task: ',
    cancelTaskDescription: 'Bạn đã bị huỷ task : ',
    leaderNewTaskDescription: 'Một task mới được tạo: ',
    leaderDoneTaskDescription: 'Thông báo xong task: ',
    deleteAllConfirm: 'Bạn có muốn xoá toàn bộ thông báo không ?',
});

export const NotificationForm = ({
    data,
    executeGetData,
    executeUpdateState,
    loading,
    unReadTotal,
    pageTotal,
    ...props
}) => {
    const [activeButtonAll, setActiveButtonAll] = useState(true);
    const [activeIcon, setActiveIcon] = useState(false);
    const translate = useTranslate();
    const [dataNotification, setDataNotification] = useState([]);
    const [isLoadMore, setIsLoadMore] = useState(false);
    let [countLoadMore, setCountLoadMore] = useState(1);
    const [hiddenItems, setHiddenItems] = useState([]);
    const [deleteAll, setDeleteAll] = useState(false);
    const [readAll, setReadAll] = useState(false);
    const [dataNotificationUnRead, setDataNotificationUnRead] = useState([]);
    const [hasNotification, setHasNotification] = useState(false);
    const navigate = useNavigate();
    const hostPath = window.location.host;
    const { profile } = useAuth();
    const { execute: executeReadAll } = useFetch(apiConfig.notification.readAll, {
        immediate: false,
    });
    const { execute: executeDeleteAll } = useFetch(apiConfig.notification.deleteAll, {
        immediate: false,
    });
    useEffect(() => {
        const interval = setInterval(() => {
            const hasNotificationLocalStr = JSON.parse(localStorage.getItem('hasNotification'));
            if (hasNotificationLocalStr && !hasNotification) {
                setHasNotification(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isLoadMore && data) {
            setDataNotification([...dataNotification, ...data]);
        } else {
            setDataNotification(data);
        }
    }, [data]);
    useEffect(() => {
        setDataNotificationUnRead(dataNotification?.filter((item) => item.kind == 0));
    }, [dataNotification]);
    useEffect(() => {
        if (activeIcon) {
            if (activeButtonAll) {
                executeGetData();
            } else {
                executeGetData({
                    params: { kind: 0 },
                });
            }
            setReadAll(false);
            setDeleteAll(false);
            localStorage.setItem('hasNotification', false);
            setHasNotification(false);
        }
        setHiddenItems([]);
    }, [activeIcon]);

    useEffect(() => {
        if (activeIcon) {
            if (!activeButtonAll) {
                executeGetData({
                    params: { kind: 0 },
                });
            } else {
                executeGetData();
            }
        }
        setIsLoadMore(false);
        setCountLoadMore(1);
        setHiddenItems([]);
    }, [activeButtonAll]);
    const iconNotification = (kind, style, size) => {
        if (kind == 1) {
            return <LiaCalendarPlusSolid color="#2196f3" style={style} size={size} />;
        } else if (kind == 2) {
            return <IoRocketOutline color="#d04d9b" style={style} size={size} />;
        } else if (kind == 3) {
            return <LiaSearchSolid color="#7c7cc8" style={style} size={size} />;
        } else if (kind == 4) {
            return <RxUpdate color="orange" style={style} size={size} />;
        } else if (kind == 5) {
            return <LuCalendarCheck2 color="#1cb01c" style={style} size={size} />;
        }
    };
    const titleNotification = (item) => {
        const kind = item?.kind;
        const projectNameTitle = ` ${item?.projectName}: `;
        const taskName = item?.taskName;
        const title = projectNameTitle;
        if (kind == 1) {
            return title + translate.formatMessage(commonMessage.newTaskTitle) + ' ' + taskName;
        } else if (kind == 2) {
            return title + translate.formatMessage(commonMessage.processTaskTitle) + ' ' + taskName;
        } else if (kind == 3) {
            return title + translate.formatMessage(commonMessage.doneTaskTitle) + ' ' + taskName;
        } else if (kind == 4) {
            return title + translate.formatMessage(commonMessage.updateTaskTitle) + ' ' + taskName;
        } else if (kind == 5) {
            return title + translate.formatMessage(commonMessage.approveTaskTitle) + ' ' + taskName;
        }
    };
    const descriptionNotification = (item) => {
        const kind = item?.kind;
        const taskName = item?.taskName ? item?.taskName : item?.lectureName;
        if (profile?.kind == UserTypes.STUDENT) {
            if (kind == 0 || kind == 5) {
                return translate.formatMessage(messages.doneTaskDescription) + taskName;
            } else if (kind == 2 || kind == 6) {
                return translate.formatMessage(messages.studentNewTaskDescription) + taskName;
            } else if (kind == 3 || kind == 7) {
                return translate.formatMessage(messages.cancelTaskDescription) + taskName;
            }
        } else if (profile?.kind == UserTypes.LEADER) {
            if (kind == 2 || kind == 6) {
                return translate.formatMessage(messages.leaderNewTaskDescription) + taskName;
            } else if (kind == 4 || kind == 8) {
                return translate.formatMessage(messages.leaderDoneTaskDescription) + taskName;
            }
        }
    };
    const timeNotification = (createdDate) => {
        const dateTime = convertStringToDateTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT).add(7, 'hour');
        const dateTimeString = convertDateTimeToString(dateTime, DEFAULT_FORMAT);
        return dateTimeString;
    };
    const handleOnClickChecked = (e, id) => {
        e.stopPropagation();
        executeUpdateState({
            data: { id },
        });

        if (hiddenItems?.length == dataNotificationUnRead?.length - 1) {
            setReadAll(true);
        }
        setHiddenItems([...hiddenItems, id]);
    };

    const handleLoadMore = () => {
        setIsLoadMore(true);
        if (!activeButtonAll) {
            executeGetData({
                params: { state: 0, page: countLoadMore },
            });
        } else {
            executeGetData({
                params: { page: countLoadMore },
            });
        }
        setCountLoadMore((countLoadMore += 1));
    };
    const handleReadAll = () => {
        executeReadAll();
        setReadAll(true);
    };
    const handleDeleteAll = () => {
        Modal.confirm({
            title: translate.formatMessage(messages.deleteAllConfirm),
            centered: true,
            okText: translate.formatMessage(commonMessage.yes),
            okType: 'danger',
            cancelText: translate.formatMessage(commonMessage.no),
            onOk: () => {
                executeDeleteAll();
                setDeleteAll(true);
            },
        });
    };
    const handleClickItem = (item) => {
        console.log(item);
        const kind = item?.kind;
        executeUpdateState({
            data: { id: item?.id },
        });
        if (hiddenItems?.length == dataNotificationUnRead?.length - 1) {
            setReadAll(true);
        }
        setHiddenItems([...hiddenItems, item?.id]);
        setActiveIcon(false);
        if (kind == 1 || kind == 4 || kind == 5) {
            navigate(
                routes.developerProjectTaskListPage.path +
                    `?projectId=${item?.projectId}&projectName=${item?.projectName}&storyId=${item?.storyId}&storyName=${item?.storyName}&active=true`,
                { state: { openModal: true, projectTaskId: item?.projectTaskId } },
            );
        } else if (kind == 2 || kind == 3) {
            navigate(
                routes.leaderProjectTaskListPage.path +
                    `?projectId=${item?.projectId}&projectName=${item?.projectName}&storyId=${item?.storyId}&storyName=${item?.storyName}&active=true`,
                { state: { openModal: true, projectTaskId: item?.projectTaskId  } },
            );
        }
    };

    return (
        <HeadlessTippy
            interactive
            placement="bottom-end"
            trigger="click"
            onClickOutside={() => setActiveIcon(false)}
            visible={activeIcon}
            onShow={() => {
                setActiveIcon(true);
            }}
            onHide={() => {
                setActiveIcon(false);
            }}
            offset={[30, 12]}
            render={(attrs) => (
                <Card className={styles.wrapper}>
                    <div className={styles.wrapperButton}>
                        <div>
                            <Button
                                type={activeButtonAll ? 'primary' : 'default'}
                                shape="round"
                                onClick={() => {
                                    setActiveButtonAll(true);
                                }}
                                style={{ marginRight: '4px' }}
                            >
                                {translate.formatMessage(commonMessage.all)}
                            </Button>
                            <Button
                                type={!activeButtonAll ? 'primary' : 'default'}
                                shape="round"
                                onClick={() => {
                                    setActiveButtonAll(false);
                                }}
                            >
                                {translate.formatMessage(commonMessage.unRead)}
                            </Button>
                        </div>
                        <div>
                            <Button type="default" shape="round" style={{ marginRight: '4px' }} onClick={handleReadAll}>
                                {translate.formatMessage(commonMessage.readAll)}
                            </Button>
                            <Button
                                style={{ color: 'white', backgroundColor: 'red' }}
                                type="default"
                                shape="round"
                                onClick={handleDeleteAll}
                            >
                                {translate.formatMessage(commonMessage.deleteAll)}
                            </Button>
                        </div>
                    </div>
                    {loading ? (
                        <div>
                            <Skeleton active paragraph={{ rows: 2 }} />
                            <Skeleton active paragraph={{ rows: 2 }} />
                            <Skeleton active paragraph={{ rows: 2 }} />
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </div>
                    ) : (
                        <div>
                            {dataNotification?.map((item) => {
                                return (
                                    <div
                                        key={item.id}
                                        className={
                                            styles.notificationItem +
                                            ' ' +
                                            ((item?.state == 1 || hiddenItems.includes(item?.id) || readAll) &&
                                                styles.viewed)
                                        }
                                        style={{
                                            display:
                                                (hiddenItems.includes(item?.id) && !activeButtonAll) ||
                                                deleteAll ||
                                                (readAll && !activeButtonAll)
                                                    ? 'none'
                                                    : '',
                                        }}
                                        onClick={() => handleClickItem(item)}
                                    >
                                        {iconNotification(item?.kind, { marginRight: '16px' }, 36)}
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                whiteSpace: 'normal',
                                                width: '410px',
                                            }}
                                        >
                                            <text style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 700 }}>{titleNotification(item)}</span>
                                                <span
                                                    style={{ fontWeight: 600, width: '350px', wordWrap: 'break-word' }}
                                                >
                                                    {descriptionNotification(item)}
                                                </span>
                                            </text>
                                            <span style={{ paddingTop: '4px' }}>
                                                {timeNotification(item?.createdDate)}
                                            </span>
                                        </div>
                                        {item?.state == 0 && !hiddenItems.includes(item?.id) && !readAll && (
                                            <BaseTooltip title={translate.formatMessage(commonMessage.markAsRead)}>
                                                <Button
                                                    type="link"
                                                    style={{ paddingRight: '10px' }}
                                                    onClick={(e) => handleOnClickChecked(e, item?.id)}
                                                >
                                                    <IconCheck color="#2b6fab" />
                                                </Button>
                                            </BaseTooltip>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {pageTotal > 0 &&
                        countLoadMore != pageTotal &&
                        !deleteAll &&
                        !(readAll && !activeButtonAll) &&
                        !loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                            <Button onClick={handleLoadMore}>
                                {translate.formatMessage(commonMessage.loadMore)}
                            </Button>
                        </div>
                    )}
                </Card>
            )}
            {...props}
        >
            <div
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => {
                    activeIcon ? setActiveIcon(false) : setActiveIcon(true);
                }}
            >
                <Badge dot={(unReadTotal > 0 && !readAll && !deleteAll && !loading) || hasNotification}>
                    {activeIcon ? <IconBellFilled /> : <IconBell />}
                </Badge>
            </div>
        </HeadlessTippy>
    );
};
