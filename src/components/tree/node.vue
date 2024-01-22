<script setup lang="ts">
/**
 * @file tree node
 * @author svon.me@gmail.com
 */

import  * as _ from "lodash-es";
import * as types from "../props";
import { isExpand } from "./util";
import { Checkbox, Radio } from "ant-design-vue";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons-vue";

import type {Node} from "src/components/tree/type";
import type { CheckboxChangeEvent } from "ant-design-vue/es/checkbox/interface";

const slots = defineSlots();
const $emit = defineEmits(["expand", "checked", "active"]);
const props = defineProps({
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
   * 数据
   */
  node: types.toObject<Node>(true),
  indeterminate: types.toObject<Node>(false, {}),
  radio: types.toBoolean(false, false),
  checkbox: types.toBoolean(false, false),
  active: types.toString<string | number>(false),
  expand: types.toArray<string | number>(false, []),
  checked: types.toArray<string | number>(false, []),
});

const iconClassName: string[] = ["ml-3", "first:ml-0", "cursor-pointer", "text-primary"];
const activeClassName: string[] = ["rounded-lg", "bg-primary", "bg-opacity-20"];

// 展开收起事件处理
const onChangeIcon = function(e: Event) {
  e.stopPropagation();
  if (props.node && props.node.children && _.size(props.node.children) > 0) {
    const key = props.node[props.primary];
    const value = !isExpand(key, props.expand);
    $emit("expand", key, value);
  }
}

// 复选框选中处理
const onChangeCheckbox = function(e: CheckboxChangeEvent) {
  const key = props.node[props.primary];
  const selected: boolean = e.target.checked;
  $emit("checked", key, selected);
}

// 选中当前节点
const onActive = function (e: Event) {
  e.stopPropagation();
  const key = props.node[props.primary];
  $emit("active", key);
}

</script>

<template>
  <div class="py-2.5 pr-2 pl-3 flex items-center text-base" :class="node[primary] === active ? activeClassName : []">
    <div v-if="radio">
      <Radio :value="node[primary]"></Radio>
    </div>
    <div v-else-if="checkbox">
      <Checkbox :checked="isExpand(node[primary], checked)" :indeterminate="indeterminate[node[primary]]" :name="`${node[primary]}-node`"  @change="onChangeCheckbox"></Checkbox>
    </div>
    <slot name="icon" :node="node" :expand="isExpand(node[primary], expand)" :class-name="iconClassName" :on-click="onChangeIcon">
      <div v-if="node.children && node.children.length > 0" :class="iconClassName" @click.stop="onChangeIcon">
        <CaretDownOutlined class="flex" v-if="isExpand(node[primary], expand)"></CaretDownOutlined>
        <CaretRightOutlined class="flex" v-else></CaretRightOutlined>
      </div>
    </slot>
    <div class="flex-1 mx-3 last:mr-0 cursor-pointer select-none" @click="onActive">
      <slot name="label" :node="node">{{ node[labelName] }}</slot>
    </div>
    <div class="select-none flex" v-if="slots.operate">
      <slot name="operate" :node="node"></slot>
    </div>
  </div>
</template>