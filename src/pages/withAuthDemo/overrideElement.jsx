/**
 * title: 组件级别权限控制
 * description: ReactCreateElement创建元素逻辑改写
 */

import {useCallback, useEffect, useState} from 'react';
// import styled from 'styled-components';
import {Button, Switch} from 'antd';
// import {toast} from '@baidu/aibc';
import {authStore, fixAuthList, overrideReactCreateElement, AUTH_SHOW_TYPE} from '@components/withAuth/index.ts';

import {getUserAuthService} from './utils';

const {setAuthData} = authStore;

overrideReactCreateElement();

export default () => {
    const [, forceUpdate] = useState({});
    const [authType, setAuthType] = useState('');

    // 仅作示例，建议放在对象 hooks 中
    const getUserAuth = useCallback(
        async authType => {
            const {result = []} = await getUserAuthService(authType);
            // mock 接口返回权限数据，可打开控制台查看
            // console.log('示例二接口返回权限数据', result);
            const {functionAuthList} = fixAuthList(result);
            setAuthData({functionAuthData: functionAuthList});
            forceUpdate({});
        },
        []
    );

    const handleAuthChange = checked => {
        if (checked) {
            setAuthType('BUTTON_FUCTION_AUTH');
        } else {
            setAuthData({functionAuthData: []});
            setAuthType('');
        }
    };

    useEffect(
        () => {
            getUserAuth(authType);
        },
        [authType, getUserAuth]
    );

    return (
        <div>
            OverrideElement-权限开关：
            <Switch
                checkedChildren="有"
                unCheckedChildren="无"
                onChange={handleAuthChange}
            />
            <p>
                权限控制按钮是否可用等样式：
                <Button
                    type="primary"
                    data-auth="auth_button"
                    data-auth-type={AUTH_SHOW_TYPE.ENABLE}
                >
                    权限按钮
                </Button>
            </p>
            <p>
                权限控制按钮是否可见：
                <Button
                    type="primary"
                    data-auth="auth_button"
                >
                    权限按钮
                </Button>
            </p>
        </div>
    );
};
