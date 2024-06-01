/**
 * @file src/components/LifeCycle/index.js index
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
*/

import React, {useState, useEffect} from 'react';

class LifeCycle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillUnmount() {
        // console.log('componentWillUnmount');
    }
    componentDidMount() {
        // console.log('componentDidMount');
    }
    componentWillReceiveProps() {
        // console.log('componentWillReceiveProps');
    }
    shouldComponentUpdate() {
        // console.log('shouldComponentUpdate');
    }
    componentDidUpdate() {
        // console.log('componentDidUpdate');
    }
    getSnapshotBeforeUpdate() {
        // console.log('getSnapshotBeforeUpdate');
    }
    render() {
        return (
            <div>LifeCycle</div>
        );
    }
}

export default LifeCycle;
