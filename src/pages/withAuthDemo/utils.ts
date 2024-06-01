
/**
 * @file mock 接口请求
 * @author liuyan45
 */

type MockType = 'LIMIT_PAGE_AUTH' | 'ALL_PAGE_AUTH' | 'MODILE_PAGE_AUTH' | 'BUTTON_FUCTION_AUTH' | undefined;

export const getUserAuthService = (type?: MockType): Promise<Record<string, any>> => {
    return new Promise(resolve => {
        if (type === 'LIMIT_PAGE_AUTH') {
            return resolve({
                success: true,
                result: [{
                    displayName: '卡片列表',
                    name: 'p_/sample/list/card'
                }]
            });
        }
        if (type === 'ALL_PAGE_AUTH') {
            return resolve({
                success: true,
                result: [
                    {
                        displayName: '首页',
                        name: 'p_/home'
                    },
                    {
                        displayName: '基础列表',
                        name: 'p_/sample/list/base'
                    },
                    {
                        displayName: '卡片列表',
                        name: 'p_/sample/list/card'
                    }
                ]
            });
        }
        if (type === 'MODILE_PAGE_AUTH') {
            return resolve({
                success: true,
                result: [{
                    displayName: '示例页模块',
                    name: 'p_/sample/list/'
                }]
            });
        }
        if (type === 'BUTTON_FUCTION_AUTH') {
            return resolve({
                success: true,
                result: [{
                    displayName: '按钮',
                    name: 'f_auth_button'
                }]
            });
        }

        return resolve([]);
    });
};
