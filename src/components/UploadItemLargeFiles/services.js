import request from '@src/server/request';

import api from '@api';
// 镜像上传（大文件）
export const initMultipartUpload = (params) => request.post(api.initMultipartUpload, params); // 初始化分片上传

export const uploadPart = (params) => request.post(api.uploadPart, params); // 上传分片

export const completePart = (params) => request.post(api.completePart, params); // 完成分片合并

export const abortPart = (params) => request.post(api.abortPart, params); // 取消分片
