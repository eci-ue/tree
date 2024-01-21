<script setup lang="tsx">
import { ref, h } from "vue";
import * as _ from "lodash-es";
import Content from "./content";
import * as types from "../props";
import Search from "../search/auto/complete";
import { Layout, LayoutHeader, LayoutContent, RadioGroup, Checkbox, Radio } from "ant-design-vue";

const slots = defineSlots();
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

const key = ref<string>(_.uniqueId("tree"));
const className = ["block", "h-full", "p-5", "overflow-auto"];

</script>

<template>
  <Layout class="h-full bg-inherit">
    <LayoutHeader class="bg-inherit p-0" style="height: initial; line-height: normal;">
      <slot name="header"></slot>
      <Search v-if="search" :list="list" :primary="primary" :foreign="foreign" :label-name="labelName"></Search>
    </LayoutHeader>
    <LayoutContent>
      <RadioGroup v-if="radio" :class="className" :value="checked[0]">{{ key }}</RadioGroup>
      <div v-else :class="className">
        <Content 
          :list="list" 
          :primary="primary" 
          :foreign="foreign" 
          :label-name="labelName" 
          :deep="deep" 
          :radio="radio" 
          :checkbox="checkbox" 
          :active="active" 
          :expand="expand" 
          :checked="checked"></Content>
      </div>
    </LayoutContent>
  </Layout>
</template>