/**
 * @file src/pages/demoTest/index.jsx index
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

import React, {useState, useEffect} from 'react';
import FixTabPanel from '@stateless/FixTabPanel';

const menuStructure = [
    {label: '主页', children: []},
    {
        label: '关于我们', children: [
            {label: '团队', children: []},
            {label: '历史', children: []}
        ]
    },
    {
        label: '服务', children: [
            {label: '咨询', children: []},
            {label: '支持', children: []}
        ]
    }
];


const DemoTest: React.FC = () => {


    // 树状组件
    const TreeNode = ({node}) => (
        <ul>
            <li>{node.label}</li>
            {node.children && node.children.length > 0 && (
                <ul>
                    {node.children.map(childNode => (
                        <TreeNode key={childNode.label} node={childNode} />
                    ))}
                </ul>
            )}
        </ul>
    );


    // 主要组件
    const TreeComponent = ({data}) => (
        <div>
            {data.map(node => (
                <TreeNode key={node.label} node={node} />
            ))}
        </div>
    );




    return <TreeComponent data={menuStructure} />;
};

export default DemoTest;
