<h1 align="center">@ue/modal</h1>

<div align="center">
  <h3>基于 Ant Design 而封装的弹框</h3>
  <p>简单配置，快速开发</p>
</div>

## 功能

- 使用简单，无需配置 Dom 结构
- 无需使用变量控制 Modal 的显示与隐藏

## 安装

```
pnpm install @ue/modal --registry http://npm.ectranslate.com/
```

**使用**

```
import * as modal from "@ue/modal";
```

## 案例

**字符**
```
<script setup lang="ts">
import * as modal from "@ue/modal";
import { Button } from "ant-design-vue";

const onClick = function() {
  modal.confirm("hello World", "提示");
}
</script>

<template>
  <div>
    <Button @click="onClick">提示</Button>
  </div>
</template>
```

**表单**
```
<script setup lang="ts">
import * as modal from "@ui/modal";
import { Input, InputPassword, Button } from "ant-design-vue";

const items = [
  {
    key: "name",
    component: Input,
    props: { placeholder: "请输入账号" }
  },
  {
    key: "password",
    component: InputPassword,
    props: { placeholder: "请输入密码" }
  }
];

const onModal = async function() {
  const data = await modal.form<{ name: string, password: string }>(items, "用户登录");
  if (data) {
    console.log(data);
  }
}
</script>

<template>
  <div>
    <Button @click="onModal">弹框模式表单</Button>
  </div>
</template>
```

**组件**

[参考@ui/form](https://github.com/eci-ui/form#readme)

## 参数配置

```
import * as modal from "@ui/modal";

import xxx from "xxx.vue";

const data = await modal.confirm(xxx, {
  title: "弹框",
  width: 600,
}, {
  // xxxx 组件所需 props 数据
})

```

名称 | 类型 | 是否必填 | 描述
-- | -- | -- | -- 
value | string、Component | 是 | 弹框内容
config | string、ModalFuncProps | 否 | Antd Modal Props 配置, 为 String 时默认为 title
props | Object | 否 | 当 value 为 Component 时有效, 以 Props 时传给该组件



**iframe**

```
import * as modal from "@ue/modal";

const onClick = function() {
  // 以全屏方式展示
  modal.iframe("url");
}