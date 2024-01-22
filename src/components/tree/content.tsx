/**
 * @file tree 节点递归
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import * as util from "./util";
import * as types from "../props";
import NodeView from "./node.vue";
import type { VNode, } from "vue";
import { defineComponent, } from "vue";
import DBList from "@fengqiaogang/dblist";
import type { Node, TreeProps } from "./type";

const Content= defineComponent({
  name: "TreeContent",
  emits: ["update:list", "update:checked", "update:active", "active", "update:expand"],
  props: {
    /**
     * 数据中主键
     */
    primary: types.toString(false, "id"),
    /**
     * 数据外键，用于关联节点与节点之间的关系
     */
    foreign: types.toString(false, "pid"),
    /**
     * 标签名称字段
     */
    labelName: types.toString(false, "name"),
    /**
     * 复选框时有用, 选中父元素时默认选中子元素
     */
    deep: types.toBoolean(false, false),
    /**
     * 数据列表
     */
    list: types.toArray<Node>(false, []),
    indeterminate: types.toObject<Node>(false, {}),
    radio: types.toBoolean(false, false),
    checkbox: types.toBoolean(false, false),
    active: types.toString<string | number>(false),
    expand: types.toArray<string | number>(false, []),
    checked: types.toArray<string | number>(false, []),
  },
  setup(props: TreeProps, { slots, emit }) {
    const onExpand = function (value: string | number, status: boolean = false) {
      let list = _.compact(_.concat([], props.expand));
      if (status) {
        list.push(value);
      } else {
        // 删除选中元素
        list = _.difference(list, [value]);
      }
      emit("update:expand", list);
    };

    const onChecked = function (key: string | number, status: boolean = false) {
      const db = new DBList<Node>(props.list, props.primary, props.foreign);
      const node = db.selectOne({ [db.primary]: key });
      const list: Array<string | number> = util.onChecked(db, props.deep, props.checked, node, status);
      emit("update:checked", list);
    };

    const onActive = function (key: string | number) {
      emit("update:active", key);
    };

    return () => {
      return _.map(props.list, function (node: Node) {
        let children: VNode | undefined;
        const childrenClassName: string[] = ["pl-6", util.isExpand(node[props.primary], props.expand) ? "block" : "hidden"];
        if (node.children && node.children.length > 0) {
          const result: object = { ...props, list: node.children };
          _.set(result, "onUpdate:expand", function (value: Array<string | number>) {
            emit("update:expand", value);
          });
          _.set(result, "onUpdate:checked", function (value: Array<string | number>) {
            emit("update:checked", value);
          });
          _.set(result, "onUpdate:active", function (value: string | number) {
            emit("update:active", value);
          });
          children = <Content {...result}>{slots}</Content>;
        }
        return (<div key={node[props.primary]}>
          <NodeView {..._.omit(props, "list") } indeterminate={ props.indeterminate } node={node} onExpand={ onExpand } onChecked={ onChecked } onActive={ onActive }>{slots}</NodeView>
          {children && <div class={childrenClassName}>{children}</div>}
        </div>);
      });
    }
  }
});

export default Content;