/**
 * @file: 静态常量
 * @author: gaopengyue(gaopengyue@baidu.com)
 */

// 防止字体设置导致行号宽度计算错误出现折行、绘制收起展开的箭头
export const MONACO_STYLES = `
    .monaco-editor .margin-view-overlays .line-numbers {
        white-space: nowrap;
    }
    .monaco-editor .codicon-folding-expanded:before,
    .monaco-editor .codicon-folding-collapsed:before {
        content: '';
        border-style: solid;
        width: 6px;
        height: 6px;
        border-width: 1px 1px 0 0;
        border-color: #555;
    }
    .monaco-editor .codicon-folding-expanded:before {
        transform: matrix(-0.71, 0.71, -0.71, -0.71, -2, -2);
    }
    .monaco-editor .codicon-folding-collapsed:before {
        transform: matrix(0.71, 0.71, -0.71, 0.71, -2, 0);
    }
    .monaco-editor .scroll-decoration {
        display: none;
    }
    .monaco-editor .codicon-close:before {
        content: "+";
        transform: rotateZ(45deg) translate(0, -3px);
        font-size: 18px;
    }
`;

// 默认错误信息
export const DEFAULT_ERROR_MESSAGE = '校验失败，请检查参数';
