import React, {useState, useEffect, useRef} from 'react';

import {useSearch} from '../..';
import useTableChange from './useTableChange';

import {post} from '../../../server';
import {
    formatFilterParam,
    formatSortParam,
    filterSelectedRow,
    isFilterItemsNotNull,
    showError,
    isRequiredValueNotNull
} from '../../../utils';

function useTableData(props) {
    const {
        api = '/api/iiom/v1/enterprise/user/account/audit/list',
        filterFields, // 过滤字段映射
        defaultSort, // 默认排序值
        searchField, // 搜索后端所需字段
        defaultPage,
        tableFnProps,
        rowKey, // 列表id
        showRowSelection, // 是否展示选择框
        defaultData,
        dependency,
        formatRes,
        extra // 需要传入的额外参数
    } = props;
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({data: defaultData || [], totalCount: 0});
    const dependSign = Array.isArray(dependency) ? dependency.join('') : '';

    // 过滤排序函数
    const {filterItems, setFilterItems, selectedRowKeys, setSelectedRowKeys, order, orderBy, searchProps, clearSort}
    = tableFnProps || {};

    const ref = useRef();

    const onRefresh = () => {
        setRefresh(!refresh);
    };

    // table change相关参数
    const tableChangeProps = useTableChange({
        defaultPage,
        tableFnProps,
        onRefresh
    });
    const {
        reqPage: {pageNo, pageSize},
        setReqPage
    } = tableChangeProps || {};

    // search 参数
    /* const searchProps = useSearch({
        searchCallback: successCallback
    }); */
    const {searchValue, setSearchValue, setChangeValue} = searchProps || {};

    // 空状态处理
    const getEmptyProps = () => {
        const hasCondition = !!orderBy || !!orderBy || !!searchValue || isFilterItemsNotNull(filterItems);
        return {
            hasCondition
        };
    };

    // 实际数据请求
    const getData = async (params) => {
        try {
            const res = await post(api, params);
            const {success, page} = res || {};
            if (success) {
                const {result, totalCount} = page || {};
                const resData = formatRes ? formatRes(res) : result;
                setData({data: resData, totalCount: totalCount || resData?.length});
            }
        } catch (e) {
            // console.log('e', e);
            showError(e?.global || e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    // 防止不同触发条件频繁触发
        clearTimeout(ref.current);
        const reqParams = {
            pageNo,
            pageSize,
            ...formatSortParam(order, orderBy, defaultSort),
            ...formatFilterParam(filterItems, filterFields),
            [searchField]: searchValue,
            ...(extra || {})
        };

        if (Array.isArray(dependency) && reqParams) {
            if (!isRequiredValueNotNull(reqParams, dependency)) {
                return;
            }
        }
        setLoading(true);
        ref.current = setTimeout(() => {
            getData(reqParams);
        }, 200);
    }, [
        pageNo,
        pageSize,
        order,
        orderBy,
        filterItems, // 应用名称过滤项
        refresh,
        searchValue,
        searchField,
        api,
        dependSign,
        JSON.stringify(extra || {})
    ]);

    // 重置功能
    const onReset = () => {
        setReqPage(defaultPage);
        setFilterItems();
        clearSort();
        setSearchValue();
        setChangeValue();
    };

    // 数据变化后处理选中selection
    useEffect(
        () => {
            if (showRowSelection) {
                setSelectedRowKeys(filterSelectedRow(data, selectedRowKeys, rowKey));
            }
        },
        [JSON.stringify(data || [])],
        showRowSelection
    );

    return {
        loading,
        ...data,

        getEmptyProps,
        paginationOpts: {
            total: data?.totalCount,
            current: pageNo,
            pageSize
        },

        onRefresh,
        searchProps,

        tableChangeProps,
        onReset
    };
}

export default useTableData;
