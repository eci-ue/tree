<script setup lang="tsx">
import { ref } from "vue";
import json from "./json.json";
import Tree from "./components/tree";
import { DBList } from "@fengqiaogang/dblist";
import { CreditCardOutlined } from "@ant-design/icons-vue";

const db = new DBList([], "deptId");
db.insert(json.data, "subList");

const list = ref<object[]>([]);

list.value = db.childrenDeep().map(function(item: object) {
  return { ...item, icon: <CreditCardOutlined></CreditCardOutlined> };
});

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
      :primary="db.primary" 
      :foreign="db.foreign" 
      labelName="deptName">
    </Tree>
  </div>
</template>