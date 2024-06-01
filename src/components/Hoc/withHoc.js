import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
/**
 * @file src/components/Hoc/withHoc.js withHoc
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 * 通过高阶组件给函数组件添加声明周期
*/
const withHoc = (Compent) => {
    class ResHoc extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        componentDidMount() {
            // console.log('componentDidMount');
        }
        componentWillUnmount() {
            // console.log('componentWillUnmount');
        }
        componentDidUpdate() {
            // console.log('componentDidUpdate');
        }
        render() {
            const {forwardRef, ...props} = this.props;
            return <Compent {...props} ref={forwardRef} />;
        }
    }

    // 如何继承Compent的静态方法？借助一个三方包
    hoistNonReactStatics(ResHoc, Compent);
    // Hoc传递ref
    return React.forwardRef((props, ref) => {
        return <ResHoc {...props} forwardRef={ref} />;
    });
};


export default withHoc;
