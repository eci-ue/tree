/**
 * @file tree 节点渲染
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import * as types from "../props";
import { defineComponent, h as createElement } from "vue";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons-vue";

import type { VNode } from "vue";
import type { Node, NodeProps as Props } from "./type";

const TreeNode = defineComponent({
  name: "TreeNode",
  emits: ["active", "expand"],
  props: {
    primary: types.toString(false, "id"),
    labelName: types.toString(false, "name"),
    list: types.toArray<Node>(false, []),
    active: types.toString<string | number>(false),
    expand: types.toArray<string | number>(false, []),
  },
  // @ts-ignore
  setup(props: Props, { emit, slots }) {
    const prefixIcon = function (node: Node, expand?: boolean, onExpand?: (expand: boolean) => void, icon?: string | VNode) {
      const onClick = function (e: Event) {
        e.stopPropagation();
        onExpand && onExpand(expand ? false : true);
      }
      const className = ["cursor-pointer", "text-xl", "text-primary"];
      if (_.isString(icon)) {
        if(slots.icon) {
          return slots.icon({ node, expand, onClick, "class": className });
        }
      } else {
        className.push("flex");
        return createElement(icon, { onClick, "class": className });
      }
      return <></>;
    }
    
    const Render = function (props: Props, node: Node, index: number, expand?: boolean, onExpand?: (expand: boolean) => void): VNode {
      let icon: VNode;
      let label: VNode | undefined;
      if (node.icon) {
        icon = prefixIcon(node, expand, onExpand, node.icon);
      } else if (node.children && node.children.length > 0) {
        icon = prefixIcon(node, expand, onExpand, expand ? <CaretDownOutlined></CaretDownOutlined> : <CaretRightOutlined></CaretRightOutlined>);
      }
      
      if (node[props.labelName]) {
        const className = "text-sm text-black text-opacity-80";
        if (_.isString(node[props.labelName])) {
          label = <span class={ className }>{ node[props.labelName] }</span>;
        } else {
          label = createElement(node[props.labelName], { "class": className });
        }
      }
      return (<div class="flex items-center">
        {icon ? <div class="w-5.5">{ icon }</div> : void 0}
        {label ? <div class="flex pl-1.5 select-none">{ label }</div> : void 0}
      </div>);
    }

    const isExpand = function (value: string | number) {
      if (props.expand && _.includes(props.expand, value)) {
        return true;
      }
      return false;
    }
    const onSelect = (_e: Event, data: Node) => {
      emit("active", data[props.primary]);
    }
    const vReader = function (node: Node, index: number, expand?: boolean, onExpand?: (expand: boolean) => void): VNode {
      if (slots.node) {
        // @ts-ignore
        return slots.node({ node, index, expand, onExpand });
      }
      return Render(props, node, index, expand, onExpand);
    }

    const main = function (list: Node[], index: number): VNode[] {
      return _.map(list, function (node: Node) {
        let value: VNode;
        const onExpand = (status: boolean) => {
          emit("expand", node[props.primary], status);
        };
        if (index === 0) {
          value = Render(props, node, index, true);
        } else {
          value = vReader(node, index, isExpand(node[props.primary]), onExpand);
        }
        const onClick = (e: Event) => {
          e.stopPropagation();
          return onSelect(e, node);
        };
        const className = ["py-2.5", "pr-2", "pl-3", "flex", "items-center", "justify-between"];
        if (props.active && node[props.primary] === props.active) {
          className.push("rounded-lg", "bg-primary", "bg-opacity-20");
        }
        const isOperate: boolean = node.menu && slots.operate ? true : false;
        return (<div class={index > 1 ? "pl-6" : ""}>
          <div class={className}>
            <div class="flex items-center flex-1">
              {
                // 复选框功能
                slots.checkbox ? slots.checkbox({ node }) : void 0
              }
              <div class={ ["cursor-pointer", "flex-1", isOperate ? "pr-3" : null] } onClick={onClick}>{value}</div>
            </div>
            {
              // 处理末尾功能菜单
              isOperate ? slots.operate({ node }) : null
            }
          </div>
          <div class={(isExpand(node[props.primary]) || index === 0) ? "block" : "hidden"}>
            {
              // 循环子级数据
              node.children ? main(node.children, index + 1) : void 0
            }
          </div>
        </div>);
      });
    }
    return () => (<>{main(props.list, 0)}</>);
  }
})

export default TreeNode;