import {createPortal} from 'react-dom';
// Portal 创建的组件 事件冒泡顺序还是遵循react的父子间关系
function MyComponent() {
    return (
        <div style={{border: '2px solid black'}}>
            <p>这个子节点被放置在父节点 div 中。</p>
            {createPortal(
                <p>这个子节点被放置在 document body 中。</p>,
                document.body
            )}
        </div>
    );
}
return MyComponent;