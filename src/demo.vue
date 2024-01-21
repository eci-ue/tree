<script setup lang="tsx">
import { ref } from "vue";
import json from "./json.json";
import Tree from "./components/tree";
import { DBList } from "@fengqiaogang/dblist";
import { CreditCardOutlined } from "@ant-design/icons-vue";

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
      :checkbox="true" 
      :transfer="true" 
      :primary="db.primary" 
      :foreign="db.foreign" 
      labelName="deptName">
        <template #icon="{ node, class: className }">
          <template v-if="node.pid === db.foreignValue">
            <CreditCardOutlined class="flex" :class="className"></CreditCardOutlined>
          </template>
        </template>
    </Tree>
  </div>
</template>