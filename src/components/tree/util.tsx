import * as _ from "lodash-es";
import DBList from "@fengqiaogang/dblist";
import type { Node, TreeProps as Props } from "./type";

export const isExpand = function (value: string | number, list?: Array<string | number>) {
  return !!(list && _.includes(list, value));
}

// 计算半选状态
export const getIndeterminate = function (db: DBList<Node>, props: Props) {
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


export const getTransferResult = function (list: Node[], primary: string, foreign: string ,keys: Array<string | number>): Node[] {
  const db = new DBList<Node>(list, primary, foreign);

  const array = db.select({[primary]: keys});

  const tmp = new DBList<Node>([], db.primary, db.foreign);
  tmp.insert(array);

  const data = new DBList<Node>(tmp.childrenDeep(), db.primary, db.foreign);
  for (const id of keys) {
    const node = data.selectOne({[primary]: id});
    if (node) {
      continue;
    }
    const value = db.selectOne({[primary]: id});
    data.insert(_.omit(value, [foreign]));
  }

  return data.childrenDeep();
}

