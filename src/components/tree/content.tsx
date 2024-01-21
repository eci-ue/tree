import * as _ from "lodash-es";
import { defineComponent } from "vue";
import * as types from "../props";
import type { Node, TreeProps } from "./type";


const Content = defineComponent({
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
    radio: types.toBoolean(false, false),
    checkbox: types.toBoolean(false, false),
    active: types.toString<string | number>(false),
    expand: types.toArray<string | number>(false, []),
    checked: types.toArray<string | number>(false, []),
  },
  setup(props: TreeProps, { slots, emit }) {
    return () => {
      return _.map(props.list, function(node: Node) {
        console.log(node);
        return <p>{ node[props.labelName] }</p>
      });
    }
  }
});

export default Content;