/**
 * @file 权限数据
 * @author liqianyu(liqianyu@baidu.com)
 */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // 权限列表
  pageAuthList: [],
  functionAuthList: [],
}

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    updatePageAuth: (state, actions) => {
      state.pageAuthList = actions.payload
    },
    updateFunctionAuth: (state, actions) => {
      state.functionAuthList = actions.payload
    },
  },
})

export const { updateFunctionAuth, updatePageAuth } = authSlice.actions
