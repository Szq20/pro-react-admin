/**
 * @file src/pages/cssDemo/CssDemo.ts CssDemo
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

import React, {useState, useEffect} from 'react';
import FixTabPanel from '@stateless/FixTabPanel';
import {BorderButton} from './components';
import './index.less';

const CssDemo = () => {
    const [count, setCount] = useState(0);

    return (
        <FixTabPanel>
            <BorderButton />
        </FixTabPanel>
    );
};

export default CssDemo;
