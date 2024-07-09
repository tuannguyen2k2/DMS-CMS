import { UserTypes, storageKeys } from '@constants';
import { commonMessage } from '@locales/intl';
import { notification } from 'antd';
import { defineMessages } from 'react-intl';
import { getData } from './localStorage';
import React from 'react';
import { IconBellRinging } from '@tabler/icons-react';

const messages = defineMessages({
    studentDoneTaskDescription: 'Bạn vừa hoàn thành task: ',
    studentNewTaskDescription: 'Bạn vừa được giao task: ',
    cancelTaskDescription: 'Bạn vừa bị huỷ task : ',
    leaderNewTaskDescription: 'Một task mới vừa được tạo: ',
    leaderDoneTaskDescription: 'Thông báo đã hoàn thành task: ',
});

export const webSocket = (tokenLogin, translate) => {
    var wsUri = process.env.REACT_APP_WEB_SOCKET_URL;
    var websocket;
    var isClosedIntentionally = false;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // If the page becomes visible, reconnect WebSocket
            webSocket();
        } else {
            // If the page becomes hidden, close WebSocket
            if (websocket) {
                isClosedIntentionally = true;
                websocket.close();
            }
        }
    }

    function init() {
        webSocket();
        setInterval(() => {
            doPing();
        }, 30000);
    }
    function webSocket() {
        websocket = new WebSocket(wsUri);

        websocket.onopen = onOpen;

        websocket.onclose = onClose;

        websocket.onmessage = onMessage;

        websocket.onerror = onError;
    }
    function onOpen(evt) {
        console.log('CONNECTED');

        var client_info = {
            cmd: 'CLIENT_INFO',
            platform: 0,
            clientVersion: '1.0',
            lang: 'vi',
            token: tokenLogin,
            app: 'CLIENT_APP',
            data: {
                app: 'CLIENT_APP',
            },
        };
        doSend(JSON.stringify(client_info));
    }

    function onClose(evt) {
        console.log('DISCONNECTED');
        if (!isClosedIntentionally) {
            setTimeout(() => {
                webSocket();
            }, 5000);
        }
        isClosedIntentionally = false;
    }

    function onMessage(evt) {
        const data = JSON.parse(evt?.data)?.data;
        console.log(data);
        if (JSON.stringify(data) !== '{}' && data) {
            notification.info({
                message: 'Thông báo',
                description: 'Bạn vừa nhận một thông báo mới!',
                duration: 10,
            });

            localStorage.setItem('hasNotification', true);
        }
        //websocket.close();
    }
    function onError(evt) {
        console.log(evt.data);
    }

    function doSend(message) {
        // console.log('SENT: ' + message);
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(message);
        } else {
            console.error('WebSocket is in CLOSING or CLOSED state.');
        }
    }
    function doReceived(message) {
        return message;
    }

    function doPing() {
        var pingRequest = {
            cmd: 'CLIENT_PING',
            platform: 0,
            clientVersion: '1.0',
            lang: 'vi',
            token: tokenLogin,
            app: 'CLIENT_APP',
            data: {
                app: 'CLIENT_APP',
            },
        };
        doSend(JSON.stringify(pingRequest));
    }
    init();
};
