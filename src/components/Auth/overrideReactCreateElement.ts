/**
 * @file  鉴权element元素改写
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

import React from 'react'
import _ from 'lodash'

import authStore from './store'
import { checkElementAuth } from './utils'

const { getFunctionAuthList } = authStore

export const AUTH_SHOW_TYPE = {
  VISIBLE: 'visible', // 可见与否
  ENABLE: 'enable', // 可用与否
}

const NO_AUTH_DISABLE_CLASSNAME = 'auth-no-auth-disable' // 未授权className

export default () => {
  const originCreateElelement = React.createElement

  // ReactCreateElement创建元素逻辑改写
  // @ts-ignore
  React.createElement = (type, config, ...children) => {
    const dataAuth = _.get(config, 'data-auth')
    const authType = _.get(config, 'data-auth-type', AUTH_SHOW_TYPE.VISIBLE)
    const className = _.get(config, 'className')
    const authList = getFunctionAuthList()
    console.log(authList)
    console.log(dataAuth)

    // 说明用户定义过权限控制属性‘data-auth’
    if (dataAuth) {
      const hasAuth = checkElementAuth(dataAuth, authList)

      // 如下是没有权限的处理解决方案
      if (!hasAuth) {
        if (authType === AUTH_SHOW_TYPE.ENABLE) {
          const newClassName = className ? `${className} ${NO_AUTH_DISABLE_CLASSNAME}` : NO_AUTH_DISABLE_CLASSNAME
          config.className = newClassName
        } else {
          return originCreateElelement(React.Fragment, null)
        }
      }
    }

    return originCreateElelement(type, config, ...children)
  }
}
