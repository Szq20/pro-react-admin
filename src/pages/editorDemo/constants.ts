/**
 * @file: 静态常量
 * @author: gaopengyue(gaopengyue@baidu.com)
 */

// 默认代码
export const DEFAULT_CODE = '{"name": "aibc", "age": 18}';

// 默认schema规则
export const DEFAULT_SCHEMAS = [
    {
        fileMatch: ['*'],
        schema: {
            type: 'object',
            required: ['name'],
            properties: {
                name: {
                    type: 'string',
                    pattern: '^[\\u4e00-\\u9fa5A-Za-z]{1,10}$',
                    errorMessage: '支持中文、英文，最大长度为10'
                },
                age: {
                    type: 'number',
                    errorMessage: '请输入正确的年龄'
                }
            }
        }
    }
];
