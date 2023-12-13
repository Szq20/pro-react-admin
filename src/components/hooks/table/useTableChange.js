import {useState} from 'react';
import isEqual from 'lodash/isEqual';

/**
 * @description table change函数封装
 * @param {*} [props={}]
 * @return {*}
 */
function useTableChange(props = {}) {
    const {onRefresh, tableFnProps, defaultPage} = props;

    const [reqPage, setReqPage] = useState(defaultPage);

    const {
        sortFn,
        singSortFn,
        isSingSort, // 默认联动排序
        filterItems,
        setFilterItems,
        setSelectedRowKeys
    } = tableFnProps || {};

    const jumpToFirstPage = () => setReqPage({...reqPage, pageNo: 1});

    /**
   * @description 统一回调处理如果不在第一页回到第一页，如果在第一页执行刷新
   */
    const successCallback = () => {
        const {pageNo} = reqPage;
        if (pageNo !== 1) {
            jumpToFirstPage();
        } else {
            onRefresh();
        }
    };

    const actionObj = {
        filter: (filters) => {
            console.log(filters, filterItems);
            const isSameFilter = isEqual(filters, filterItems);
            if (isSameFilter) {
                return null;
            }
            setFilterItems(filters);
            jumpToFirstPage();
        },
        paginate: (pagination) => {
            const {pageSize: currentSize} = reqPage;
            const {current, pageSize} = pagination;
            const isPageSizeChange = currentSize !== pageSize;
            setReqPage({
                pageNo: isPageSizeChange ? 1 : current,
                pageSize
            });
            // 切换页数后清空选中项
            if (!isPageSizeChange) {
                setSelectedRowKeys([]);
            }
        },
        sort: isSingSort ? singSortFn : sortFn
    };

    /**
   * @param {*} pagination
   * @param {*} filters
   * @param {*} sorter
   * @param {*} extra action paginate | sort | filter
   */
    const onTableChange = (pagination, filters, sorter, extra) => {
        console.log(pagination, filters, sorter, extra, 'pagination, filters, sorter, extra');
        const {action} = extra;

        const dataObj = {
            filter: filters,
            sort: sorter,
            paginate: pagination
        };
        actionObj[action](dataObj[action]);
    };

    return {
        reqPage,
        setReqPage,
        jumpToFirstPage,

        successCallback,
        onTableChange
    };
}

export default useTableChange;
