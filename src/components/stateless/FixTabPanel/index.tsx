import React from 'react';

export interface FixTabPanelProps {
    // 定义组件的 props 类型
    children: React.ReactNode;
}
const FixTabPanel: React.FC<FixTabPanelProps>
    = ({children}): React.ReactNode =>
        <div style={{width: '100%', minHeight: 'calc(100vh - 232px)'}}>{children}</div>;

export default FixTabPanel;
