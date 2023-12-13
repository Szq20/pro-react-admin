import request from '@server/request';

import api from '@api';
// api注册说明
export const getSchema = (getSchemaUri) => request.get(getSchemaUri);
