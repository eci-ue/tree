import TreeNode from "./node";
import * as _ from "lodash-es";
import DBList from "@fengqiaogang/dblist";
import { Checkbox, Radio } from "ant-design-vue";
import type { Slot } from "vue";
import type { Node, TreeProps as Props } from "./type";

// 计算半选状态
const getIndeterminate = function (db: DBList<Node>, props: Props) {
  const indeterminate: object = {};
  if (props.radio || !props.checked || _.size(props.checked) < 1) {
    return indeterminate;
  }
  for (const key of props.checked) {
    const list = db.parentDeepFlatten({ [db.primary]: key });
    for (const node of list) {
      const id = node[db.primary];
      if (_.includes(props.checked, id)) {
        continue;
      }
      _.set(indeterminate, id, true);
    }
  }
  return indeterminate;
};

export const onChecked = function (
  db: DBList<Node>,
  deep: boolean,
  checked: Array<string | number>,
  node: Node,
  Selected?: boolean
) {
  const value = node[db.primary];
  let checkedList = _.concat([], checked || []);
  if (deep) {
    // 递归计算
    // 求子元素
    const childrenList = db.childrenDeepFlatten({ [db.primary]: value }).map((item: Node) => item[db.primary]);
    if (Selected) {
      // 添加子元素
      checkedList.push(...childrenList);
    } else if (_.includes(checkedList, value)) {
      // 删除选中元素
      checkedList = _.difference(checkedList, childrenList);
    } else {
      // 添加子元素
      checkedList.push(...childrenList);
    }

    // 去重
    checkedList = _.uniq(checkedList);

    const parents = db.parentDeepFlatten({ [db.primary]: value });
    for (const item of parents) {
      const key = item[db.primary];
      const where = { [db.primary]: key };
      const list = _.concat(
        [key],
        db.siblings(where).map((data: Node) => data[db.primary])
      );
      // 计算差集
      const intersection = _.intersection(checkedList, list);
      // 假如当前列表节点全选中
      if (intersection.length === list.length) {
        // 将父节点设为选中状态
        checkedList.push(item[db.foreign]);
      } else {
        // 删除选中元素
        checkedList = _.difference(checkedList, [item[db.foreign]]);
      }
    }
  } else {
    // 普通模式
    const key = node[db.primary];
    if (_.includes(checked, key)) {
      // 删除选中元素
      checkedList = _.difference(checked, [key]);
    } else {
      checkedList.push(key);
    }
  }
  return _.uniq(checkedList);
};

export const onActive = function (value: string | number, emit: (event: string, value: any) => void) {

  emit("active", value);
  emit("update:active", value);
};

export const VNode = function (
  key: string,
  props: Props,
  slots: object,
  emit: (event: string, value: any) => void
) {
  const db = new DBList<Node>(props.list, props.primary, props.foreign);

  const onExpand = function (value: string | number, status: boolean = false) {
    let list = _.compact(_.concat([], props.expand));
    if (status) {
      list.push(value);
    } else {
      // 删除选中元素
      list = _.difference(list, [value]);
    }
    emit("update:expand", list);
  };
  // 复选框选中事件
  const onClick = function (node: Node) {
    const checked = onChecked(db, props.deep || false, props.checked, node);
    emit("update:checked", checked);
  };
  let checkbox: Slot;
  if (props.checkbox || props.radio) {
    checkbox = getCheckbox(key, props, getIndeterminate(db, props), onClick);
  }
  const children = { ..._.omit(slots, ["header"]), checkbox };

  const option = {
    primary: props.primary,
    labelName: props.labelName,

    list: props.list,

    active: props.active,
    onActive: (value: string | number) => onActive(value, emit),

    expand: props.expand,
    onExpand: onExpand,
  };
  return <TreeNode {...option}>{children}</TreeNode>;
};

const getCheckbox = function (
  key: string,
  props: Props,
  indeterminate: object,
  onClick: (value: Node) => void
) {
  if (props.checkbox) {
    return function ({ node }: { node: Node }) {
      const value = node[props.primary];
      const status = _.get(indeterminate, value) ? true : false;
      const checked = _.includes(props.checked, value);
      const onChange = () => onClick(node);
      return (
        <div class="mr-2">
          <Checkbox
            checked={checked}
            name={`${key}-node`}
            indeterminate={status}
            onChange={onChange}
          ></Checkbox>
        </div>
      );
    };
  }
  if (props.radio) {
    return function ({ node }: { node: Node }) {
      const value = node[props.primary];
      return (
        <div class="mr-2">
          <Radio class="mr-0" value={value}></Radio>
        </div>
      );
    };
  }
};
