/**
 * @file 存储权限数据
 * @author liqianyu@baidu.com
 */

function getAuthStore() {
    let authData = {
        functionAuthData: [],
        pageAuthData: []
    };

    function setAuthData(data = {}) {
        authData = {
            ...authData,
            ...data
        };
    }

    function getAuthData() {
        return authData;
    }

    return {
        setAuthData,
        getAuthData
    };
}
export default getAuthStore();
