import * as types from "../../props";
import DBList from "@fengqiaogang/dblist";
import { AutoComplete } from "ant-design-vue";
import { defineComponent, h as createElement, ref } from "vue";
import type { Node, SearchProps } from "../../tree/type";

export default defineComponent({
  name: "UeSearch",
  emits: ["select"],
  props: {
    /**
     * 数据列表
     */
    list: types.toArray<Node>(false, []),
    primary: types.toString(false, "id"),
    foreign: types.toString(false, "pid"),
    labelName: types.toString(false, "name"),
  },
  setup (props: SearchProps, { emit }) {
    const keyword = ref<string>();
    const dataSource = ref<object[]>([]);

    const state = function(): DBList<Node> {
      const db = new DBList<Node>([], props.primary, props.foreign);
      db.insert(props.list);
      return db;
    };

    const onSelect = function(value: any) {
      const db = state();
      const data = db.selectOne({ [db.primary]: value });
      if (data) {
        keyword.value = data[props.labelName];
        emit("select", data[db.primary]);
      } else {
        keyword.value = value;
      }
    }

    const onSearch = function(text: string) {
      const db = state();
      let list: Node[];
      if (text &&text.trim()) {
        const where = { [props.labelName]: text.trim() };
        list = db.like(where);
      } else {
        list = [];
      }
      dataSource.value = list.map(function(data: Node) { 
        const id = data[props.primary];
        const node = { ...data, value: id, label: data[props.labelName], key: id };
        const parents = db.parentDeepFlatten({ [db.primary]: data[db.foreign] });
        if (parents.length > 0) {
          const value = parents.map((item: Node) => item[props.labelName]).reverse().join(" / ");
          return {
            value,
            label: value,
            options: [ node ]
          }
        }
        return node;
      });
    }
    return () => {
      return createElement("div", { style: "padding: 20px 20px 0 20px;" }, [
        createElement(AutoComplete, {
          style: "width: 100%;",
          value: keyword.value,
          options: dataSource.value,
          placeholder: "Search",
          autocomplete: "off",
          onSearch,
          onSelect,
          "onUpdate:value": function(text: any) {
            keyword.value = text;
          }
        })
      ]);
    };
  }
})