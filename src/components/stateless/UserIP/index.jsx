import {log} from 'console';
import React, {useState, useEffect, useRef} from 'react';
// import UserAgent from 'user-agents'

const UserIP = () => {
    const [userIp, setUserIp] = useState('');
    const [count, setcount] = useState(0);
    const prev = useRef();
    const updateRef = useRef();

    // const userAgent = new UserAgent()
    useEffect(() => {
        // console.log(count, '挂载、更新执行');
        return () => { // 组件销毁时执行，更新也会执行
            // console.log(count, '组件销毁时执行，更新也会执行 count是上一次的值');
        };
    }, [count]);

    // useEffect(() => {
    //     // console.log(updateRef, 'update---');
    //     if (!updateRef.current) {
    //         // 组件挂载时执行
    //         // console.log('组件挂载时执行');
    //         updateRef.current = true;
    //     } else {
    //         // 组件更新时执行
    //         // console.log('组件更新时执行');
    //     }
    // });

    // useEffect(() => {
    //     // console.log('useEffect2');
    //     prev.current = count;
    // });// 执行2次 v18 fiber架构
    // const prevCount = prev.current;
    const getUserIp = () => {
        fetch('https://api.ipify.org?format=json')
            .then((response) => response.json())
            .then((data) => {
                const ipAddress = data.ip;
                setUserIp(ipAddress ?? '0.0.0.0');
            })
            .catch(() => {
                setUserIp('0.0.0.0');
            });
    };
    const len = 3000;
    return (
        <>
            <h2>欢迎您，来自远方的朋友！</h2>
            {/* <h3>您的IP: {userIp}</h3>
            <h3> {userAgent.toString()}</h3> */}
            <button onClick={() => setcount(count + 1)}>点击</button>
            <h3> newCount{count} </h3>
            {/* <h3> prevCount:{prevCount} </h3> */}
        </>
    );
};

export default UserIP;
