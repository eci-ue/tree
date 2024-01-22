<script setup lang="tsx">
import { computed } from "vue";
import * as _ from "lodash-es";
import Content from "./content";
import * as types from "../props";
import { getIndeterminate } from "./util";
import DBList from "@fengqiaogang/dblist";
import Search from "../search/auto/complete";
import { Layout, LayoutHeader, LayoutContent, RadioGroup } from "ant-design-vue";
import type {Node} from "src/components/tree/type";

const slots = defineSlots();
const $emit = defineEmits(["expand"]);
const props = defineProps({
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
})

const expandValue = computed<Array<string | number>>({
  get: () => props.expand,
  set: (value: Array<string | number>) => {
    $emit("update:expand", value);
  }
});
const checkedValue = computed<Array<string | number> | string | number>({
  get: () => {
    if (props.radio) {
      return props.checked[0];
    }
    return _.concat([], props.checked);
  },
  set: (value: Array<string | number> | string | number) => {
    const list = _.concat([], value);
    $emit("update:checked", list);
  }
});

const activeValue = computed<string | number>({
  get: () => props.active,
  set: (value: string | number) => {
    $emit("update:active", value);
  }
});

const indeterminate = computed(function () {
  const db = new DBList<Node>(props.list, props.primary, props.foreign);
  return getIndeterminate(db, {
    radio: props.radio,
    checked: props.checked,
    primary: props.primary,
  } as any);
});

</script>

<template>
  <Layout class="h-full bg-inherit">
    <LayoutHeader class="bg-inherit p-0" style="height: initial; line-height: normal;">
      <slot name="header"></slot>
      <Search v-if="search" :list="list" :primary="primary" :foreign="foreign" :label-name="labelName"></Search>
    </LayoutHeader>
    <LayoutContent>
      <component class="block h-full p-5 overflow-auto" :is="radio ? RadioGroup : 'div'" v-model:value="checkedValue">
        <Content
          :list="list" 
          :primary="primary" 
          :foreign="foreign" 
          :label-name="labelName" 
          :deep="deep" 
          :radio="radio"
          :checkbox="checkbox"
          :indeterminate="indeterminate"
          v-model:active="activeValue"
          v-model:expand="expandValue"
          v-model:checked="checkedValue">
          <template v-for="(index, name) in $slots" :key="`${index}-${name}`" v-slot:[name]="scope">
            <slot :name="name" v-bind="scope"></slot>
          </template>
        </Content>
      </component>
    </LayoutContent>
  </Layout>
</template>