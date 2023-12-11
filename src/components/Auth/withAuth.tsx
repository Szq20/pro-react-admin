/**
 * @file  权限注入高阶组件(用于复杂组件权限构建)
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

/**
 * withAuth 高阶组件，根据authExpression获取功能权限并渲染对应组件内容
 *
 * WrappedComponent 当前默认组件
 * authExpression 当前组件权限表达式，支持 string
 * （1）对于单权限点控制，如存在权限点 A，当权限点 A 有权限，组件即有权限，则可设置 authExpression 为 A
 * （2）对于多权限点控制，如存在A 、B 为两个权限点，
 *     当前组件在 A、B 都有权限时才有权限，则可设置 authExpression 为 `${A} & ${B}`
 *     若 A 、B  中有一个有权限，组件即有权限，则可设置 authExpression 为 `${A} | ${B}`
 * noAuthOption 当无功能点权限时，渲染的组件内容
 *
 * noAuthOption 组织逻辑
 * 1. 当其为 React 函数组件或类组件时，直接以空props渲染本身
 * 2. 当其为纯对象时，如果有有效的component属性，则以其props属性渲染component
 * 3. 当其为纯对象且无有效component属性时，以其本身作为props渲染被包裹组件
 * 4. falsy值，以空props渲染被包裹组件
 */

import * as React from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'

import { checkElementAuth } from './utils'

interface NoAuthOptionComplexType {
  props: Record<string, any>
  component: React.ComponentType<any>
}

type NoAuthOption = NoAuthOptionComplexType | Record<string, any> | React.ComponentType<any>

interface AuthComponentProps {
  renderredComponent: React.ComponentType<any>
  renderredProps: Record<string, any>
}

/**
 * 判断是否为 React 组件。
 *
 * @param component - 需要判断的任意对象。
 * @returns 如果是 React 组件则返回 true，否则返回 false。
 */
function isValidReactComponent(component: any) {
  return React.isValidElement(component)
}

/**
 * 获取渲染后的组件、属性
 *
 * @param hasAuth 是否有权限
 * @param noAuthOption 无权限选项，可以是一个函数或一个包含 component 和 props 属性的对象
 * @param defaultComponent 默认组件类型
 * @returns 返回一个包含渲染后的组件和属性的对象
 */
function getRenderredComponent(
  hasAuth,
  noAuthOption: NoAuthOption,
  defaultComponent: React.ComponentType<any>
): AuthComponentProps {
  let renderredProps = {}
  let renderredComponent = defaultComponent

  if (!hasAuth) {
    if (isValidReactComponent(noAuthOption)) {
      renderredComponent = noAuthOption as React.ComponentType<any>
    } else if (_.isPlainObject(noAuthOption)) {
      const noAuthObject = noAuthOption as NoAuthOptionComplexType
      if (isValidReactComponent(noAuthObject?.component)) {
        renderredProps = noAuthObject.props || {}
        renderredComponent = noAuthObject.component
      } else {
        renderredProps = noAuthObject
      }
    }
  }

  return {
    renderredComponent,
    renderredProps,
  }
}

const withAuth =
  (
    WrappedComponent: React.ComponentType<any>,
    authExpression: string,

    noAuthOption: NoAuthOption
  ) =>
  (props) => {
    const { functionAuthList } = useSelector((state: any) => state.authSlice)

    const hasAuth = checkElementAuth(authExpression, functionAuthList)
    const { renderredComponent: RenderredComponent, renderredProps } = getRenderredComponent(
      hasAuth,
      noAuthOption,
      WrappedComponent
    )

    const mergedProps = _.assign({}, props, renderredProps)

    return <RenderredComponent {...mergedProps} />
  }

export default withAuth
