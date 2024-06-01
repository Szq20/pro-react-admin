/**
 * @file 状态收口文件
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
*/

import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from './userSlice';

export const rootReducer = {
    userSlice: userSlice.reducer // 用户信息reducer
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
});