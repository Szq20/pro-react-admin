import React, {useEffect} from 'react';
import {Layout, Space, Dropdown, Switch, theme} from 'antd';
import {UserOutlined, LogoutOutlined, GithubOutlined, DownOutlined, SmileOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {removeLocalStorage} from '@utils/publicFn';

import {useProThemeContext} from '@theme/hooks';

import PrimaryNav from '../primaryNav';
import styles from './index.module.less';
import Fullscreen from '../fullscreen';

import {getUserDetail} from '@services';

const ProHeader = () => {
    const navigate = useNavigate();
    const redirectTo = (path) => {
        navigate(path);
    };

    const redirectGithub = () => {
        window.open('https://github.com/Szq20/pro-react-admin', '_blank');
    };

    const items = [
        {
            key: '1',
            label: <Space>个人中心</Space>,
            icon: <UserOutlined />,
            onClick: () => {
                redirectTo('/profile');
            }
        },
        {
            key: '2',
            label: <Space>个人设置</Space>,
            icon: <SmileOutlined />,
            onClick: () => {
                redirectTo('/setting');
            }
        },
        {
            key: '3',
            label: <Space>退出登录</Space>,
            icon: <LogoutOutlined />,
            onClick: () => {
                removeLocalStorage('token');
                redirectTo('/signin');
            }
        }
    ];

    const {myTheme, setMyTheme} = useProThemeContext();

    const setAntdTheme = () => {
        setMyTheme(myTheme === 'light' ? 'dark' : 'light');
    };

    const {
        token: {colorBgContainer, colorBorder}
    } = theme.useToken();
    const getData = async () => {
        try {
            const res = await getUserDetail();
            console.log(res, 'res');
        } catch (error) {
            console.log(error, 'error');
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Layout.Header
            className={styles.header}
            style={{background: colorBgContainer, borderBottom: `1px solid ${colorBorder}`}}
        >
            <div aria-hidden="true" className={styles.logo} onClick={() => redirectTo('/')}>
                {/* Pro React <Tag>{process.env.DEPLOYED_ENV}</Tag> */}
                Pro React Admin
            </div>
            <div className={styles.headerMeta}>
                <div className={styles.headerMenu}>
                    <PrimaryNav />
                </div>
                <div className={styles.headerRight}>
                    <Space direction="horizontal" style={{cursor: 'pointer', paddingRight: 8}}>
                        <Switch
                            // checkedChildren={<Icon component={LightSvg} />}
                            // unCheckedChildren={<Icon component={DarkSvg} />}
                            onClick={setAntdTheme}
                        />
                        <GithubOutlined style={{fontSize: 16}} onClick={redirectGithub} />
                        <Fullscreen />
                    </Space>

                    <Dropdown
                        arrow
                        menu={{
                            items
                        }}
                    >
                        <Space>
                            <span style={{fontSize: 18}}>wkylin.w</span>
                            <DownOutlined />
                        </Space>
                    </Dropdown>
                </div>
            </div>
        </Layout.Header>
    );
};

export default ProHeader;
