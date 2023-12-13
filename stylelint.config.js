/*
 * @Author: zhoupengfei03
 * @Date: 2021-12-21 20:08:33
 * @LastEditTime: 2022-01-10 19:11:19
 * @LastEditors: Please set LastEditors
 * @FilePath: /blue-cli/.stylelintrc.js
 * @Description: stylelint配置
 */
module.exports = {
    'extends': '@ecomfe/stylelint-config',
    'plugins': [
        'stylelint-declaration-block-no-ignored-properties'
    ],
    'rules': {
        'plugin/declaration-block-no-ignored-properties': true,
        'rule-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'at-rule-no-unknown': null,
        'function-comma-space-after': null,
        'at-rule-name-case': null,
        'property-no-unknown': null,
        'declaration-block-no-shorthand-property-overrides': null,
        'declaration-empty-line-before': null,
        'color-hex-case': 'upper',
        'no-eol-whitespace': null,
        'no-duplicate-selectors': null,
        'function-calc-no-unspaced-operator': null,
        'no-missing-end-of-source-newline': null,
        'selector-list-comma-newline-after': null,
        'max-empty-lines': null,
        'color-hex-case': null,
        'block-closing-brace-empty-line-before': null,
        'block-opening-brace-space-before': null,
        'block-no-empty': null,
        'declaration-colon-space-after': null,
        'number-leading-zero': null,
        'color-hex-length': null,
        'no-empty-source': null,
        'number-no-trailing-zeros': null,
        'comment-empty-line-before': null
    }
};
