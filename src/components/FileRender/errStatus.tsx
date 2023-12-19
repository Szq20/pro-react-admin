/**
* @file  ErrStatus 文件预览错误状态
* @author shenzhiqiang01
* @date 2023-08-17
*/

import {ExclamationCircleOutlined} from '@ant-design/icons';
import {BaseProps} from '@typings';

interface ErrStatusProps extends BaseProps {
    des?: string | undefined
}

const ErrStatus = (props: ErrStatusProps) => {
    const {des} = props;
    return (
        <div className="err-status">
            <ExclamationCircleOutlined />
            <span>
                {des ? des : '暂不支持该类型文档预览'}
            </span>
        </div>
    );
};


export default ErrStatus;
