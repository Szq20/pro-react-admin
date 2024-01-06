import React from 'react';
import ReactDOM from 'react-dom/client';
import {ProThemeProvider} from './theme/hooks';
import ThemeIndex from './theme';
import {Provider as ReduxProvider} from 'react-redux';
import {store} from '@redux';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
    <ReduxProvider store={store}>
        <ProThemeProvider>
            <ThemeIndex />
        </ProThemeProvider>
    </ReduxProvider>
);
