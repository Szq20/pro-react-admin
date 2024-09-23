/**
 * @file 权限相关工具函数
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

import _ from 'lodash';

// 将 string 中所有中划线改成下划线(idaas 权限值设置只支持下划线，所以拿 path 比较时，需将 url 中的中划线都转成下划线)
const replaceHyphenWithUnderscore = (str: string) => str.replace(/-/g, '_');

// 检验元素是否有权限
export const checkElementAuth = (authExpression, authList) => {
    const fixedAuthExpression = authExpression.replace(/(\/\S+)/g, (str) => {
        const fixedStr = replaceHyphenWithUnderscore(str);
        if (_.includes(authList, fixedStr)) {
            return true;
        }
        return false;
    });

    let res = false;
    try {
        const func = new Function(`return ${fixedAuthExpression}`);
        res = func();
    } catch (err) {
        console.error(err);
    }
    return !!res;
};

/**
 * 校验 path 是否有权限
 * 前者精确匹配权限点
 * 后者匹配模块权限点的情况 p_{modulePath}/
 * 比如 当拥有了  p_/iiom/app-center/app-manage/  这个模块权限之后， 所有前端path 以 /iiom/app-center/app-manage/ 开头的都有权限。
 */
const verifyAuth = (path, authList) => {
    const fixedPath = replaceHyphenWithUnderscore(path);
    return _.some(authList, (item) => item === fixedPath || (_.endsWith(item, '/') && _.startsWith(fixedPath, item)));
};

/**
 * routers 拦截函数，增加权限数据
 * 通过 authMap 校验 route 是否有权限，有权限则向 router 数据中添加 hasAuth: true
 */
export const traverseAuthRoutes = (routers, authList) =>
    _.map(routers, (item) => {
        const {path, redirect, routes} = item;
        const hasAuth = verifyAuth(redirect || path, authList);
        if (hasAuth) {
            return _.isEmpty(routes)
                ? {
                    ...item,
                    hasAuth: true
                }
                : {
                    ...item,
                    hasAuth: true,
                    routes: traverseAuthRoutes(routes, authList)
                };
        }
        return item;
    });

/**
 * headerMenu 权限筛选函数
 */
export const getAuthHeaderMenu = (headerMenuData, authList) => {
    const authHeaderMenu = _.filter(headerMenuData, ({key}) => {
        const fixedKey = replaceHyphenWithUnderscore(key);
        const flagKeyArr = _.compact(fixedKey.split('/'));
        return _.some(authList, (item) => {
            const flayAuthItem = _.compact(item.split('/'));
            return _.isEqual(flagKeyArr, _.slice(flayAuthItem, 0, flagKeyArr.length));
        });
    });
    return authHeaderMenu.length === 1 ? [] : authHeaderMenu;
};

/**
 * sidebar 筛选函数
 */
export const getAuthSidebarData = (data, authList) => {
    const filterSidebarData = (data, authList) =>
        _.reduce(
            data,
            (res, curValue) => {
                if (!curValue?.children) {
                    const hasAuth = verifyAuth(curValue.path, authList);
                    return hasAuth ? [...res, curValue] : res;
                }
                const filterChildren = filterSidebarData(curValue?.children || [], authList);
                return _.isEmpty(filterChildren)
                    ? res
                    : [
                        ...res,
                        {
                            ...curValue,
                            children: filterChildren
                        }
                    ];
            },
      [] as any[]
        );
    const sidebarData = filterSidebarData(data?.sidebarData || [], authList);
    return {
        ...data,
        sidebarData
    };
};
