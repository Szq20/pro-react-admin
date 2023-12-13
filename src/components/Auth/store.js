/**
 * @file 存储权限数据
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

function funAuthData() {
    let authList = [];

    function setFunctionAuthList(authData) {
        authList = authData;
    }

    function getFunctionAuthList() {
        return authList;
    }

    return {
        setFunctionAuthList,
        getFunctionAuthList
    };
}
export default funAuthData();
