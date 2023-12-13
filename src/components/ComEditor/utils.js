import {API_COMMON_PREFIX} from '@constants/global';
import yaml from 'js-yaml';
import {showError} from '../../../utils';

const customDefSchema = {
    requestParameters: {
        type: 'object',
        properties: {
            parmmeters: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            required: true
                        },
                        in: {
                            enum: ['query', 'header', 'path', 'cookie'],
                            required: true
                        },
                        description: {
                            type: 'string'
                        },
                        required: {
                            type: 'boolean'
                        }
                    }
                }
            },
            requestBody: {
                type: 'object',
                properties: {
                    description: {
                        type: 'string'
                    },
                    content: {
                        type: '',
                        required: true
                    },
                    required: {
                        type: 'boolean'
                    }
                }
            }
        }
    },
    response: {
        type: 'object',
        properties: {
            description: {
                type: 'string'
            },
            content: {
                type: '',
                required: true
            },
            required: {
                type: 'boolean'
            }
        }
    }
};

const defaultSchema = (getSchemaUri, match, schemaKey, languageType) => [
    {
        uri: getSchemaUri,
        fileMatch: [`requestParameters${match}`],
        schema: customDefSchema.requestParameters
    },
    {
        uri: getSchemaUri,
        fileMatch: [`response${match}`],
        schema: customDefSchema.response
    }
];
const defaultJsonSchema = (getSchemaUri, schemaKey, editorID, yamlMatch) => {
    const schemaProperties = {
        parmmeters: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        required: true
                    },
                    in: {
                        enum: ['query', 'header', 'path', 'cookie'],
                        required: true
                    },
                    description: {
                        type: 'string'
                    },
                    required: {
                        type: 'boolean'
                    }
                }
            }
        },
        requestBody: {
            type: 'object',
            properties: {
                description: {
                    type: 'string'
                },
                content: {
                    type: '',
                    required: true
                },
                required: {
                    type: 'boolean'
                }
            }
        },
        description: {
            type: 'string'
        },
        content: {
            type: '',
            required: true
        },
        required: {
            type: 'boolean'
        }
    };
    // if (schemaKey === 'requestParameters') {
    //     delete schemaProperties.content;
    //     delete schemaProperties.description;
    //     delete schemaProperties.required;
    // } else {
    //     delete schemaProperties.requestBody;
    //     delete schemaProperties.parmmeters;
    // }

    // // console.log(schemaProperties, 'schemaProperties');

    return [
        {
            uri: getSchemaUri,
            fileMatch: ['*'],
            schema: {
                type: 'object',
                properties: schemaProperties
            }
        }
    // {
    //     uri: getSchemaUri,
    //     fileMatch: ['requestParameters' + yamlMatch],
    //     schema: customDefSchema.requestParameters
    //     // schema: {
    //     //     'type': 'object',
    //     //     'properties': schemaProperties
    //     // }
    // },
    // {
    //     uri: getSchemaUri,
    //     fileMatch: ['response' + yamlMatch],
    //     schema: customDefSchema.response
    //     // schema: {
    //     //     'type': 'object',
    //     //     'properties': schemaProperties
    //     // }
    // }
    ];
};

const yamlToJsonFormat = (text) => {
    // 加载YAML数据
    // const text = model.getValue(); // 获取文件内容
    let formatYaml = null;
    try {
        const parsedData = yaml.load(text);
        formatYaml = JSON.stringify(parsedData, null, 2);
    // const yamlData = yaml.dump(parsedData);
    // model.setValue(testjson); // 更新编辑器内容
    } catch (error) {
        showError('语法解析错误, 请检查语法');
        console.error('yaml.load', error);
    // console.log(error, 'error---');
    } finally {
    // console.log(formatYaml, 'yamlToJsonFormat---');
    }
    return formatYaml;
};
const jsonToYamlFormat = (text) => {
    // 加载YAML数据
    // yaml.dump json -》 yaml
    // yaml.load yaml -》 json
    let formatJson = null;
    try {
    // 传过来的是json
        const parseText = JSON.parse(text);
        formatJson = yaml.dump(parseText, {indent: 2});
    } catch (error) {
    // 传过来的是Yaml
        try {
            const yamlData = yaml.load(text, {schema: yaml.JSON_SCHEMA});
            formatJson = yaml.dump(yamlData, {indent: 2});
        } catch (error) {
            showError('语法解析错误, 请检查语法');
        }
    } finally {
    // console.log(formatJson, 'yamlToJsonFormat---');
    }
    return formatJson;
};
const fromatCode = (editor) => {
    // console.log('formatDocument格式化');
    editor.getAction('editor.action.formatDocument').run();
    if (editor?.getValue() && editor?.getModel()) {
        try {
            editor?.setSelection({
                // 折叠展开后的鼠标选中位置
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: 1,
                endColumn: editor?.getModel()?.getLineLength ? editor?.getModel()?.getLineLength(1) : 0
            });
        } catch (error) {
            // console.log('折叠展开后的鼠标选中位置:' + error);
        }
    }
};

export {defaultSchema, defaultJsonSchema, customDefSchema, jsonToYamlFormat, yamlToJsonFormat, fromatCode};
