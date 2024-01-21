import * as _ from "lodash-es";
import * as util from "./util";
import { VNode, defineComponent } from "vue";
import * as types from "../props";
import DBList from "@fengqiaogang/dblist";
import Search from "../search/auto/complete";
import { Layout, LayoutHeader, LayoutContent, RadioGroup } from "ant-design-vue";

import type { Node, TreeProps } from "./type";


export default defineComponent({
  name: "UeTree",
  emits: ["update:list", "update:checked", "update:active", "active", "update:expand"],
  props: {
    /**
     * 是否展示Search
     */
    search: types.toBoolean(false, true),
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
     * 穿梭框
     */
    transfer: types.toBoolean(false, false),
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
    const key = _.uniqueId("tree");
    const onRadioChange = function (value: string | number) {
      emit("update:checked", [value]);
    }

    const onSelect = function (key: string) {
      const db = new DBList<Node>(props.list, props.primary, props.foreign);
      const node = db.selectOne({ [db.primary]: key });
      if (node) {
        const parents = db.parentDeepFlatten({ [db.primary]: node[db.foreign] }).map((item: Node) => item[db.primary]);
        const expand = _.uniq(_.compact(_.concat([], props.expand, parents)));
        const checked = util.onChecked(db, props.deep || false, props.checked, node, true);
        util.onActive(key, emit as any);
        emit("update:expand", expand);
        emit("update:checked", checked);
      }
    }
    const className = ["block", "h-full", "p-5", "overflow-auto"];
    return () => {
      const value = util.VNode(key, props, slots, emit as any);
      let content: VNode;
      if (props.radio) {
        const checked = props.checked ? props.checked[0] : void 0;
        content = <RadioGroup value={checked} class={ className } onUpdate:value={onRadioChange}>{value}</RadioGroup>;
      } else {
        content = <div class={ className }>{value}</div>;
      }
      return (<Layout style="background-color: initial; height: 100%;">
        <LayoutHeader style="background-color: initial; padding-inline: 0; height: initial; line-height: normal;">
          {slots.header ? slots.header() : null}
          {props.search && <Search primary={props.primary} foreign={props.foreign} list={props.list} labelName={ props.labelName } onSelect={onSelect}></Search>}
        </LayoutHeader>
        <LayoutContent>
          {content}
        </LayoutContent>
      </Layout>);
    }
  }
})