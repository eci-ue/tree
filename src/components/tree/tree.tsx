/**
 * @file Tree
 * @author svon.me@gmail.com
 */

import * as _ from "lodash-es";
import Content from "./content";
import * as types from "../props";
import { defineComponent } from "vue";
import DBList from "@fengqiaogang/dblist";
import Search from "../search/auto/complete";
import { SwapOutlined } from "@ant-design/icons-vue";
import { Node, TreeProps } from "src/components/tree/type";
import { getIndeterminate, getTransferResult, onChecked } from "./util";
import { Layout, LayoutHeader, LayoutContent, RadioGroup } from "ant-design-vue";


export default defineComponent({
  name: "Tree",
  emits: ["update:active", "update:checked", "update:expand"],
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
    const updateHook = {};
    _.set(updateHook, "onUpdate:active", function (value: string | number) {
      emit("update:active", value);
    });
    _.set(updateHook, "onUpdate:checked", function (value: Array<string | number>) {
      emit("update:checked", value);
    });
    _.set(updateHook, "onUpdate:expand", function (value: Array<string | number>) {
      emit("update:expand", value);
    });

    const onSelect = function (key: string) {
      const db: DBList<Node> = new DBList<Node>(props.list, props.primary, props.foreign);
      const node: Node = db.selectOne({ [db.primary]: key });
      if (node) {
        const parents: Array<string | number> = db.parentDeepFlatten({ [db.primary]: node[db.foreign] }).map((item: Node) => item[db.primary]);
        const expand: Array<string | number> = _.uniq(_.compact(_.concat([], props.expand, parents)));
        const checked: Array<string | number> = onChecked(db, props.deep || false, props.checked, node, true);
        updateHook["onUpdate:active"](key);
        updateHook["onUpdate:expand"](expand);
        updateHook["onUpdate:checked"](checked);
      }
    }

    return () => {
      const db = new DBList<Node>(props.list, props.primary, props.foreign);
      const indeterminate = getIndeterminate(db, {
        radio: props.radio,
        checked: props.checked,
        primary: props.primary,
      } as any);
      const treeContent = function (value: Node[]) {
        const attr: object = { ...props, ...updateHook, indeterminate, list: value };
        const nodes = (<Content class="h-full" {...attr}>{slots}</Content>);
        if (props.radio) {
          const change = function (keys: string | number) {
            const list: Array<string | number> = _.concat([], keys);
            updateHook["onUpdate:checked"](list);
          };
          const option: object = { value: props.checked[0], "onUpdate:value": change };
          return <RadioGroup class="block h-full" {...option}>{nodes}</RadioGroup>
        }
        return <div class="h-full">{nodes}</div>;
      }
      const body = function () {
        // 穿梭狂模式
        if (props.transfer && (props.checkbox || props.radio)) {
          const list: Node[] = getTransferResult(props.list, props.primary, props.foreign, props.checked);
          const className: string[] = ["h-full", "border", "border-solid", "border-[#d9d9d9]", "rounded-md", "p-2"];

          return (<div class="h-full relative">
            <div class="h-full w-1/2 pr-5">
              <div class={className}>{treeContent(props.list)}</div>
            </div>

            <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="flex items-center px-3 text-lg text-primary"><SwapOutlined /></div>
            </div>

            <div class="absolute right-0 top-0 bottom-0 w-1/2 pl-5">
              <div class={className}>{treeContent(list)}</div>
            </div>
          </div>);
        }
        // 正常模式
        return treeContent(props.list);
      }
      // 头部有内容时
      if (slots.header || props.search) {
        return (<Layout class="h-full bg-inherit">
          <LayoutHeader class="bg-inherit p-0 h-[initial] leading-[normal]">
            {
              // 附加头部信息
              slots.header && slots.header()
            }
            {
              // 是否需要展示搜素功能
              props.search && <Search {..._.pick(props, ["list", "primary", "foreign", "labelName"])} onSelect={onSelect}></Search>
            }
          </LayoutHeader>
          <LayoutContent class="tree-body p-5 overflow-auto">
            {
              // 内容
              body()
            }
          </LayoutContent>
        </Layout>);
      }
      return (<div class="tree-body p-5 h-full overflow-auto">{body()}</div>);
    }
  }
});


