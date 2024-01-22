<script setup lang="tsx">
import { ref } from "vue";
import json from "./json.json";
import Tree from "./components/tree";
import { DBList } from "@fengqiaogang/dblist";
import { CreditCardOutlined, EllipsisOutlined } from "@ant-design/icons-vue";

const db = new DBList([], "deptId");
db.insert(json.data, "subList");

const list = ref<object[]>([]);

list.value = db.childrenDeep();

const active = ref<string>();
const expand = ref<string[]>([]);
const checked = ref<string[]>([]);


</script>

<template>
  <div class="h-100">
    <Tree 
      v-model:active="active" 
      v-model:expand="expand" 
      v-model:checked="checked" 
      :list="list" 
      :radio="false"
      :checkbox="true"
      :transfer="true" 
      :primary="db.primary" 
      :foreign="db.foreign" 
      labelName="deptName">
        <template #icon="{ node, className, onClick }">
          <template v-if="node[db.primary] === 0">
            <CreditCardOutlined :class="className" @click="onClick"></CreditCardOutlined>
          </template>
        </template>
        <template #label="{ node }">{{ node['deptName'] }}</template>
        <template #operate>
          <EllipsisOutlined />
        </template>
    </Tree>
  </div>
</template>