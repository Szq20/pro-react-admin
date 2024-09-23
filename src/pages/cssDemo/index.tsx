/**
 * @file src/pages/cssDemo/CssDemo.ts CssDemo
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

import React, {useState, useEffect} from 'react';
import FixTabPanel from '@stateless/FixTabPanel';
import {BorderButton} from './components';
import MultiColorBorder from '@stateless/MultiColorBorder';
import './index.less';

const CssDemo = () => {

    return (
        <>
            <FixTabPanel>
                <BorderButton />
            </FixTabPanel>
            <FixTabPanel>
                <section style={{width: 200, height: 60}}>
                    <MultiColorBorder text="多色彩边框文案" />
                </section>
            </FixTabPanel>
        </>
    );
};

export default CssDemo;
