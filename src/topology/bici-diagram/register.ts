import { registerNode } from '../core'
import {biciTimer,biciTimerIconRect,biciTimerTextRect} from './timer'
import {biciVarer,biciVarerIconRect,biciVarerTextRect} from './varer'

// name - node名称.
// drawFn - node渲染函数。上面的myShape
// anchorsFn - 计算node的锚点，如果为null，表示使用缺省计算锚点方法
// iconRectFn - 计算node的图标区域，如果为null，表示使用缺省计算图标区域方法
// textRectFn - 计算node的文字区域，如果为null，表示使用缺省计算文字区域方法
// force - 如果已经存在同名node，是否覆盖.
// export function registerNode(
//   name: string, // myShape
//   drawFn: (ctx: CanvasRenderingContext2D, node: Node) => void,
//   anchorsFn?: (node: Node) => void,
//   iconRectFn?: (node: Node) => void,
//   textRectFn?: (node: Node) => void,
//   force?: boolean
// );

export function register() {
  registerNode("biciTimer",biciTimer,null,biciTimerIconRect,biciTimerTextRect,true)
  registerNode("biciVarer",biciVarer,null,biciVarerIconRect,biciVarerTextRect,true)
}
