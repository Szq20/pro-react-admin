/**
 * @file 用户相关数据
 * @author guowei26
 */
import {createSlice} from '@reduxjs/toolkit';

export interface UserDetail {
    'id': number,
    'name': string,
    'phone': number,
    'age': number,
    'description': string,
    'role': string
}

const initialState = {
    // 用户详情
    userDetail: {
        'id': '',
        'name': '',
        'phone': '',
        'age': undefined,
        'description': '',
        'role': ''
    }
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        // 更新用户信息
        updateUser: (state, actions) => {
            state.userDetail = actions.payload;
        }
    }
});


export const {
    updateUser
} = userSlice.actions;
