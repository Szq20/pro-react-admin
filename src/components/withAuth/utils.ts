/**
 * @file 权限相关工具函数
 * @author liqianyu@baidu.com
*/

import _ from 'lodash';

import {FUNCTION_AUTH_PREFIX, PAGE_AUTH_PREFIX} from './constants';
import {
    AuthDataItemType,
    ContentItemInstance,
    FixedAuthDataType,
    HeaderMenuItemInstance,
    RouterItemType,
    SidebarItemInstance
} from './interface';

/**
 * 将字符串中的连字符 (-) 替换为下划线 (_)。
 * idaas 权限值设置只支持下划线，所以拿 path 比较时，需将 url 中的中划线都转成下划线
 *
 * @param {string} str 要进行替换操作的字符串
 * @returns {string} 返回替换后的新字符串
 */
const replaceHyphenWithUnderscore = (str: string): string => str.replace(/-/g, '_');

/**
 * 根据给定的权限表达式检验元素是否有权限
 *
 * @param {string} authExpression 权限表达式
 * @param {string[]} authList 权限列表
 * @returns {boolean} 如果有权限，则返回true；否则返回false
 */

export const checkElementAuth = (authExpression: string, authList: string[]): boolean => {
    const authExpressionStr = String(authExpression);
    const logicOperators = ['||', '&&'];
    const fixedAuthExpression = authExpressionStr.replace(
        /(\S+)/g,
        str => {
            // 判断是否是逻辑运算符，如果是则直接返回
            if (_.includes(logicOperators, str)) {
                return str;
            }
            const fixedStr = replaceHyphenWithUnderscore(str);
            if (_.includes(authList, fixedStr)) {
                return 'true';
            }
            return 'false';
        }
    );

    let res = false;
    try {
        // eslint-disable-next-line no-new-func
        const func = new Function(`return ${fixedAuthExpression}`);
        res = func();
    } catch (err) {
        console.error(err);
    }
    return !!res;
};

/**
 * 验证给定的 path 是否有权限
 * 判断函数前者精确匹配权限点
 * 后者匹配模块权限点的情况 p_{modulePath}/
 * 比如 当拥有了 p_/iiom/app-center/app-manage/  这个模块权限之后， 所有前端 path 以 /iiom/app-center/app-manage/ 开头的都有权限。
 *
 * @param {string} path 要验证的路径
 * @param {string[]} authList 权限列表
 * @returns {boolean} 如果路径满足列表中的至少一个条件，则返回true；否则返回false。
 */
export const verifyAuth = (path: string, authList: string[]): boolean => {
    // 修正 path 数据，将中划线替换为下划线
    // (idaas 中定义的权限点数据不支持中划线统一使用的下划线，前端 url 中一般使用中划线作为连接符，所以需要统一一下形式)
    const fixedPath = replaceHyphenWithUnderscore(path);
    return _.some(authList, item =>
        item === fixedPath || (_.endsWith(item, '/') && _.startsWith(fixedPath, item))
    );
};

/**
 * routers 拦截函数，遍历路由列表并根据权限列表返回有权限的路由
 *
 * @param {RouterItemType[]} routers 要遍历的路由列表
 * @param {string[]} authList 权限列表
 * @returns {RouterItemType[]} 返回一个新的数组，其中包含有权限的路由对象
 */
export const traverseAuthRoutes = (routers: RouterItemType[], authList: string[]): RouterItemType[] =>
    _.reduce(routers, (res, curVal) => {
        const {path, redirect, routes = []} = curVal;
        // 使用 verifyAuth 函数验证当前路由的路径（path 或 redirect）是否在授权列表中
        const hasAuth = verifyAuth(redirect || path, authList);
        // 如果当前路由在授权列表中
        if (hasAuth) {
            // 如果当前路由没有子路由，则直接将当前路由添加到结果列表中
            // 如果当前路由有子路由，则递归调用 traverseAuthRoutes 函数处理子路由
            return _.isEmpty(routes) ? [
                ...res,
                curVal
            ] : [
                ...res,
                {
                    ...curVal,
                    routes: traverseAuthRoutes(routes, authList)
                }
            ];
        }
        return res;
    }, [] as any[]);

/**
 * @description 筛选出有权限的侧边栏列表
 * @param {ContentItemInstance[]} data 侧边栏列表数据
 * @param {string[]} authList 权限列表
 * @returns {ContentItemInstance[]} 返回一个新的侧边栏列表，其中只包含有权限的项
 */
const filterAuthSidebarList = (data: ContentItemInstance[], authList: string[]): ContentItemInstance[] =>
    _.reduce(data, (res, curValue) => {
        // 如果当前菜单项不存在 children 且有 path，直接根据 path 判断是否有权限
        if (!curValue?.children && curValue.path) {
            const hasAuth = verifyAuth(curValue.path, authList);
            return hasAuth ? [
                ...res,
                curValue
            ] : res;
        }
        // 如果当前菜单项存在 children，则继续往下遍历 children 数组，递归调用 filterAuthSidebarList 函数
        const filterChildren = filterAuthSidebarList(curValue?.children || [], authList);
        return _.isEmpty(filterChildren) ? res : [
            ...res,
            {
                ...curValue,
                children: filterChildren
            }
        ];
    }, [] as ContentItemInstance[]);

/**
 * 获取经过权限筛选后的侧边栏数据
 * @param {SidebarItemInstance[]} data 原始侧边栏数据列表
 * @param {string[]} authList 用户权限列表
 * @returns {SidebarItemInstance[]} 经过权限筛选后的侧边栏数据列表
 */
export const getAuthSidebarMenu = (data: SidebarItemInstance[], authList: string[]): SidebarItemInstance[] =>
    _.map(data, item => {
        // 获取侧边栏内容，兼容 sidebarData 和 content 两种格式
        const key = item?.sidebarData ? 'sidebarData' : 'content';
        const originSidebarData = item?.[key];
        // 如果 originSidebarData 存在，则对其进行授权过滤处理，并返回一个新的侧边栏项对象，其中包含更新后的侧边栏数据
        // 如果 originSidebarData 不存在，则直接返回原始的侧边栏项对象 item
        return originSidebarData ? {
            ...item,
            [key]: filterAuthSidebarList(originSidebarData, authList)
        } : item;
    });

/**
 * 获取第一个侧边栏末级跳转路径
 *
 * @param {ContentItemInstance[]} authSidebar 侧边栏数据
 * @returns {string} 第一个侧边栏末级跳转路径
 */
const getFirstAuthPath = (authSidebar: ContentItemInstance[]): string => {
    // 初始化一个空字符串 firstPath，用于存储找到的第一个末级路径
    let firstPath = '';
    const handleData = data => {
        // 获取当前数据数组的第一个元素 firstItem，如果不存在则赋值为一个空对象
        const firstItem: ContentItemInstance = _.head(data) || {} as ContentItemInstance;
        // 检查 firstItem 是否有子元素
        if (_.isEmpty(firstItem?.children)) {
            // 如果没有子元素，则将 firstItem 的路径赋值给 firstPath 变量
            firstPath = firstItem?.path || '';
        } else {
            // 如果有子元素，则递归调用 handleData 函数，继续递归遍历子元素数组
            handleData(firstItem.children);
        }
    };
    handleData(authSidebar);
    return firstPath;
};

/**
 * 获取经过权限筛选后的导航菜单数据
 * @param {HeaderMenuItemInstance[]} headerMenuData 原始导航菜单数据
 * @param {SidebarItemInstance[]} sidebarData 原始侧边栏数据列表
 * @param {string[]} authList 用户权限列表
 * @returns {HeaderMenuItemInstance[]} 经过权限控制后的导航菜单数据
 */
export const getAuthHeaderMenu = (
    headerMenuData: HeaderMenuItemInstance[],
    sidebarData: SidebarItemInstance[],
    authList: string[]
): HeaderMenuItemInstance[] => {
    const authHeaderMenu = _.reduce(headerMenuData, (res, curVal) => {
        const {path = '', sidebarKey} = curVal;
        // 如果当前菜单项没有关联的侧边栏（sidebarKey 为空）
        // 调用 verifyAuth 函数检查当前菜单项的路径是否在 authList 中存在授权
        if (!sidebarKey) {
            const hasAuth = verifyAuth(path, authList);
            return hasAuth ? [...res, curVal] : res;
        }
        // 如果当前菜单项关联了侧边栏（sidebarKey 不为空）
        // 使用 reduce 将侧边栏数据转换为以 key 为索引的对象形式，方便后续通过 sidebarKey 获取对应的侧边栏数据
        const sidebarObj = _.reduce(sidebarData, (res, curVal) => {
            res[curVal.key] = curVal;
            return res;
        }, {});
        // 通过 sidebarKey 获取当前菜单项关联的侧边栏数据 currentSidebar
        const currentSidebar = sidebarObj?.[sidebarKey] || {};
        // 获取侧边栏的内容数据，兼容 sidebarData 和 content 两种格式
        const sidebarContent = currentSidebar.sidebarData || currentSidebar.content || [];
        // 调用 filterAuthSidebarList 筛选侧边栏内容，得到有权限的侧边栏数据 authSidebar
        const authSidebar = filterAuthSidebarList(sidebarContent, authList);
        // 如果 authSidebar 为空，说明当前菜单项关联的侧边栏内容没有授权，则当前菜单项无需返回
        if (_.isEmpty(authSidebar)) {
            return res;
        }
        // 如果 authSidebar 不为空
        // 获取 authSidebar 的第一个非空路径作为当前菜单项的跳转 path，并返回当前菜单项
        const firstAuthPath = getFirstAuthPath(authSidebar);
        return [
            ...res,
            {
                ...curVal,
                path: firstAuthPath
            }
        ];
    }, [] as HeaderMenuItemInstance[]);
    return authHeaderMenu;
};

/**
 * 处理接口返回的权限点数据
 *
 * @param {AuthDataItemType[]} data 接口返回权限点数据 result
 * @param {string} functionPrefix  功能权限点前缀 默认 f_
 * @param {string} pagePrefix  页面权限点前缀 默认 p_
 * @returns {FixedAuthDataType} {functionAuthList, pageAuthList}
 */
export const fixAuthList = (
    data: AuthDataItemType[],
    functionPrefix = FUNCTION_AUTH_PREFIX,
    pagePrefix = PAGE_AUTH_PREFIX
): FixedAuthDataType => {
    const pageAuthList: string[] = [];
    const functionAuthList: string[] = [];
    _.map(data, ({name}) => {
        if (_.startsWith(name, functionPrefix)) {
            functionAuthList.push(name.replace(functionPrefix, ''));
        } else {
            pageAuthList.push(name.replace(pagePrefix, ''));
        }
    });
    return {pageAuthList, functionAuthList};
};
