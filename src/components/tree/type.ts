import type { VNode } from "vue";

export interface Node {
  id: string | number;     // 节点 ID
  pid: string | number;    // 父节点 ID
  name: string | VNode;    // 节点名称, 如果为 VNode 时不支持搜素
  icon?: string | VNode;   // 图标名字或者Vue 组件
  children?: Node[];       // 子数据
  indeterminate?: boolean; // 复选框半选状态
  [key: string]: any;      // 其余数据
}

export interface SearchProps {
  list: Node[];
  primary: string;
  foreign: string;
  labelName: string;
}

export interface Props extends SearchProps {
  expand: Array<string | number>;     // tree 展开状态
  active?: string | number;           // 节点选中（非复选框/单选框选中）
}

export interface NodeProps extends Props {
}

export interface TreeProps extends Props {
  deep?: boolean;
  search?: boolean;                      // 是否启用搜素功能
  checked: Array<string | number>;       // 复选框/单选框选中状态
  checkbox?: boolean;      // 是否启用复选框功能
  radio?: boolean;         // 是否启用单选框功能
  indeterminate: object;
}