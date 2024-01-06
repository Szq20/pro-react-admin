#### 3.1.2 redux使用说明

数据共享采用@reduxjs/toolkit

* reducer定义参考menu.slice
* 状态获取 

示例获取menu.slice.js中的menu状态

```
import {useSelector} from 'react-redux';
const {menu} = useSelector(state => state.menuSlice);
```

* 状态更新 使用定义的reducer方法

示例：更新menu状态

```
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
    updateMenu
} from '@redux/menu.slice';
import {getSidebarData} from './layout';

const MainPage = () => {
		const dispatch = useDispatch();
		useEffect(() => {
        const sidebarData = getSidebarData(location.pathname);
        dispatch(updateMenu(sidebarData));
    }, [location.pathname]);
}
```
