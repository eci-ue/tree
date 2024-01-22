# @ue/tree

基于 Ant Design 而封装的 tree 组件

## 安装

```
pnpm install @ue/tree --registry http://npm.ectranslate.com/
```

### 基础数据

```json
[
  {
    "deptId": 165,
    "deptName": "A",
    "deptIcon": null,
    "deptColor": null,
    "haveSub": 1,
    "pid": -1,
    "children": [
      {
        "deptId": 167,
        "deptName": "A1",
        "deptIcon": null,
        "deptColor": null,
        "haveSub": 1,
        "pid": 165,
        "children": [
          {
            "deptId": 170,
            "deptName": "A1-2",
            "deptIcon": null,
            "deptColor": null,
            "haveSub": 0,
            "pid": 167
          }
        ]
      },
      {
        "deptId": 171,
        "deptName": "A2",
        "deptIcon": null,
        "deptColor": null,
        "haveSub": 1,
        "pid": 165,
        "children": [
          {
            "deptId": 172,
            "deptName": "A2-1",
            "deptIcon": null,
            "deptColor": null,
            "haveSub": 0,
            "pid": 171
          }
        ]
      },
      {
        "deptId": 190,
        "deptName": "1229",
        "deptIcon": null,
        "deptColor": null,
        "haveSub": 0,
        "pid": 165
      }
    ]
  },
  {
    "deptId": 166,
    "deptName": "B",
    "deptIcon": null,
    "deptColor": null,
    "haveSub": 1,
    "pid": -1,
    "children": [
      {
        "deptId": 168,
        "deptName": "B2",
        "deptIcon": null,
        "deptColor": null,
        "haveSub": 0,
        "pid": 166
      },
      {
        "deptId": 191,
        "deptName": "1229",
        "deptIcon": null,
        "deptColor": null,
        "haveSub": 0,
        "pid": 166
      }
    ]
  },
  {
    "deptId": 173,
    "deptName": "11",
    "deptIcon": null,
    "deptColor": null,
    "haveSub": 1,
    "pid": -1,
    "children": [
      {
        "deptId": 192,
        "deptName": "1229",
        "deptIcon": null,
        "deptColor": null,
        "haveSub": 0,
        "pid": 173
      }
    ]
  }
]
```

### 使用

```vue
<script setup lang="ts">
import tree from "@ue/tree";

const list = ref<object[]>([...]);    // 基础数据
const active = ref<string>();      // 记录选中的节点数据
const expand = ref<string[]>([]);  // 记录已展开的节点数据
const checked = ref<string[]>([]); // 记录已选中的节点数据
</script>

<template>
  <div style="width: 300px; height: 500px;">
    <Tree 
      v-model:active="active" 
      v-model:expand="expand" 
      v-model:checked="checked"
      :list="list"
      :checkbox="true"
      primary="deptId"
      foreign="pid"
      labelName="deptName">
    </Tree>
  </div>
</template>
```

### Slots Icon
```vue
<template>
  <div style="width: 300px; height: 500px;">
    <Tree 
      v-model:active="active" 
      v-model:expand="expand" 
      v-model:checked="checked"
      :list="list"
      :checkbox="true"
      primary="deptId"
      foreign="pid"
      labelName="deptName">

      <template #icon="{ node, className, onClick }">
        <!-- 
          此处自定义 icon 的展示
          Node: 节点数据
          className: 默认的 class 名称
          onClick: 点击事件回调方法
        -->
      </template>
      
    </Tree>
  </div>
</template>
```

### Slots Label
```vue
<template>
  <div style="width: 300px; height: 500px;">
    <Tree 
      v-model:active="active" 
      v-model:expand="expand" 
      v-model:checked="checked"
      :list="list"
      :checkbox="true"
      primary="deptId"
      foreign="pid"
      labelName="deptName">

      <template #label="{ node }">
        <!-- 
          此处自定义 label 的展示
          Node: 节点数据
        -->
      </template>
      
    </Tree>
  </div>
</template>
```

### Slots Operate

此 Slot 为节点右侧末尾功能, 可以自定义右键菜单功能

```vue
<template>
  <div style="width: 300px; height: 500px;">
    <Tree 
      v-model:active="active" 
      v-model:expand="expand" 
      v-model:checked="checked"
      :list="list"
      :checkbox="true"
      primary="deptId"
      foreign="pid"
      labelName="deptName">

      <template #operate="{ node }">
        <!-- 
          此处自定义 operate 的展示
          Node: 节点数据
        -->
      </template>
      
    </Tree>
  </div>
</template>
```


### 参数配置

名称 | 类型               | 是否必填 | 默认值       | 描述
--- |------------------|---|-----------| -- 
search | Boolean          | 否 | true      | 搜索框
primary | String           | 否 | id        | 节点数据主键字段
foreign | String           | 否 | pid       | 节点父级数据外键字段
labelName | String           | 否 | name      | 节点名称字段
list | Object[]         | 否 | []        | 节点列表数据
checkbox | Boolean          | 否 | false     |是否启用复选框   
radio | Boolean          | 否 | false | 是否启用单选框   
active | string \| number | 否 | undefined | 选中的节点数据主键
expand | Array<string \| number>          | 否 | []        | 已展开的节点数据
checked | Array<string \| number>          | 否 | []        | 已选中的节点数据
deep | Boolean | 否 | false     | checkbox 为 true 有用, 选中父元素时是否默认选中子元素 
transfer | Boolean | 否 | false  | checkbox / radio 为 true 有用, 以穿梭框的风格在右侧展示已选中的节点数据

