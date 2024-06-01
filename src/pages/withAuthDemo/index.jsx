/**
 * @file src/pages/withAuthDemo/index.jsx index
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
*/

import React, {useState, useCallback, useEffect} from 'react';
import {authStore, fixAuthList, withAuth} from '@components/withAuth/index.ts';
import {getUserAuthService} from './utils';
import {Button, Switch, Tooltip} from 'antd';

import OverrideElement from './overrideElement';

const NullComponent = () => {
    return <>NullComponent</>;
};


const Index = () => {
    const [, forceUpdate] = useState({});
    const [authType, setAuthType] = useState('');

    const {setAuthData} = authStore;

    // 仅作示例，建议放在对象 hooks 中
    const getUserAuth = useCallback(
        async authType => {
            const {result = []} = await getUserAuthService(authType);
            // mock 接口返回权限数据，可打开控制台查看
            // // console.log('示例三接口返回权限数据', result);
            const {functionAuthList} = fixAuthList(result);
            // // console.log(functionAuthList, 'functionAuthList---');
            setAuthData({functionAuthData: functionAuthList});
            forceUpdate({});// 触发Render
        },
        []
    );

    useEffect(
        () => {
            getUserAuth(authType);
        },
        [authType, getUserAuth]
    );

    const AuthButton = withAuth(
        Button,
        'auth_button',
        NullComponent
    );

    const handleAuthChange = checked => {
        if (checked) {
            setAuthType('BUTTON_FUCTION_AUTH');
        } else {
            setAuthData({functionAuthData: []});
            setAuthType('');
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: 100}}>
            <OverrideElement />
            <div>
                Hoc-withAuth-权限开关：
                <Switch
                    checkedChildren="有"
                    unCheckedChildren="无"
                    onChange={handleAuthChange}
                />
                <p>
                    权限控制按钮是否可见：
                    <AuthButton type="primary">
                        权限按钮
                    </AuthButton>
                </p>
            </div>
        </div>

    );
};


export default Index;
