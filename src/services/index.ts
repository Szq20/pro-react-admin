import {default as apis} from './api';

import {post} from '@server';

export const getUserDetail = params => post(apis.userDetail, params); // 获取分类列表