/**
 * @file auth interface
 * @author liqianyu@baidu.com
 */

export interface RouterItemType {
    path: string; // 路由路径
    redirect?: string; // 重定向路径
    title?: string; // 页面标题
    routes?: RouterItemType[]; // 页面级子路由
    component?: React.ReactNode; // 页面布局组件
    layout?: React.ReactNode; // 页面布局组件
    exact?: boolean; // 设置为 true 时只有路径完全匹配才渲染对应组件
    hideSideNav?: boolean; // 隐藏侧导航
    hideHeaderNav?: boolean; // 隐藏顶部导航
}

export interface AuthDataItemType {
    displayName: string; // 权限点名称
    name: string; // 权限点标识
}

export interface FixedAuthDataType {
    functionAuthList: string[]; // 功能权限点列表
    pageAuthList: string[]; // 页面权限点列表
}

export interface ContentItemInstance {
    key: string; // 唯一标识
    title: string; // 标题
    icon?: React.ReactNode; // 图标
    path?: string; // 路径
    children?: ContentItemInstance[]; // 子菜单
}

export interface SidebarItemInstance {
    key: string; // 唯一标识
    title: string; // 标题
    icon?: React.ReactNode; // 图标
    content?: ContentItemInstance[]; // 侧边栏内容数据，兼容 contentData 和 sidebarData 两种数据格式
    sidebarData?: ContentItemInstance[];
}

export interface HeaderMenuItemInstance {
    key: string; // 唯一标识
    name?: string; // 标题，兼容 name 和 title 两种数据格式
    title?: string;
    path?: string; // 路径
    sidebarKey?: string; // 关联的侧边栏key
}
