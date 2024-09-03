/**
 * @file: 代码编辑器工具
 * @author: gaopengyue(gaopengyue@baidu.com)
 */

/**
 * openapi 2.0、3.0 使用schema版本 draft-04，对应包 ajv-draft-04
 * openapi 3.1 使用 draft/2020-12，对应包 ajv/dist/2020
 * Ajv默认使用的 draft-07
 */

import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

import AjvDraft04 from 'ajv-draft-04';
import AjvDraft202012 from 'ajv/dist/2020';
import {JSONSchemaType} from 'ajv';
import addFormats from 'ajv-formats';
import {configureMonacoYaml} from 'monaco-yaml';
import yaml from 'js-yaml';

import {
    OPENAPI_SCHEMA_20,
    OPENAPI_SCHEMA_30,
    OPENAPI_SCHEMA_31,
    OPENAPI_VERSION_REG_31,
    OPENAPI_VERSION_REG_30
} from './openApiSchema';

// 校验 OpenAPI
export const createOpenApiValidator = openApiVersion => {
    let schema: JSONSchemaType<typeof OPENAPI_SCHEMA_30> | any = null;
    let ajvHandle: any = null;

    // OpendApi 3.1版本
    if (new RegExp(OPENAPI_VERSION_REG_31).test(openApiVersion)) {
        schema = OPENAPI_SCHEMA_31;
        ajvHandle = new AjvDraft202012();
    } else if (new RegExp(OPENAPI_VERSION_REG_30).test(openApiVersion)) {
        // OpendApi 3.0
        schema = OPENAPI_SCHEMA_30;
        ajvHandle = new AjvDraft04();
    } else {
        // OpendApi 2.0
        schema = OPENAPI_SCHEMA_20;
        // 2.0 3.0 版本使用 draft-04
        ajvHandle = new AjvDraft04();
    }

    // 增加字段校验
    addFormats(ajvHandle);

    // 配置校验规则
    const validator = ajvHandle.compile(schema);

    return validator;
};

export const configMonacoYaml = (monaco, schemas) => {
    configureMonacoYaml(monacoEditor, {
        validate: true,
        completion: true,
        enableSchemaRequest: true,
        schemas
    });
};

export const configMonacoJson = (monaco, schemas, schemaValidation = 'error') => {
    monacoEditor.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemaValidation: 'error',
        schemas
    });
};

export const json2Yaml = value => {
    try {
        const jsonVal = JSON.parse(value);
        return yaml.dump(jsonVal, {indent: 2});
    } catch (error) {
        console.error(error);
        return value;
    }
};
export const yaml2Json = value => {
    try {
        const yamlVal = yaml.load(value);
        return JSON.stringify(yamlVal, null, 2);
    } catch (error) {
        console.error(error);
        return value;
    }
};
