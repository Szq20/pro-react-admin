import {useState} from 'react';
import {handleSort, handleSingleSort} from '../utils';

/**
 * table相关函数
 * @return {*}
 */
function useTableFn(props) {
    const {showRowSelection, rowSelectionProps} = props || {};
    const {selectCallback} = rowSelectionProps || {};
    const [filterItems, setFilterItems] = useState();
    const [order, setOrder] = useState(); // 排序选中值拼接字符串
    const [orderBy, setOrderBy] = useState(); // 排序字段拼接的字符串
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中的行keys

    const sortFn = (sorter) => {
        const {order, orderBy} = handleSort(sorter);
        setOrder(order);
        setOrderBy(orderBy);
    };

    const singSortFn = (sorter) => {
        const {order, orderBy} = handleSingleSort(sorter);
        setOrder(order);
        setOrderBy(orderBy);
    };

    const clearSort = () => {
        setOrder();
        setOrderBy();
    };

    /**
   * 清楚过滤项
   */
    const clearFilter = () => {
        setFilterItems();
    };

    /**
   * 复选框勾选事件
   */
    const onSelectChange = (rowKeys, ...args) => {
        setSelectedRowKeys(rowKeys);
        selectCallback && selectCallback(rowKeys, ...args);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        ...(rowSelectionProps || {})
    };

    const tableRowSelectionProps = showRowSelection
        ? {
            rowSelection
        }
        : {};

    return {
        order,
        orderBy,
        sortFn,
        singSortFn,
        clearSort,

        filterItems,
        setFilterItems,
        clearFilter,
        isSingSort: false,

        rowSelection,
        selectedRowKeys,
        setSelectedRowKeys,
        tableRowSelectionProps
    };
}

export default useTableFn;
