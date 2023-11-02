import React from "react";
import cls from "classnames";
import _ from "lodash";
import { Popconfirm, Space, Tooltip } from "antd";
import {
  LinkOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { IArticleData } from "@/app/_type/config";
import Link from "next/link";

type ITreeNodeProps = {
  nodeData?: IArticleData[0];
  onAdd?: React.MouseEventHandler<HTMLSpanElement>;
  onRemove?: () => void;
  onLinkAction?: (link: string) => void;
};

export default function TreeNode(props: ITreeNodeProps) {
  const {
    nodeData,
    onAdd = () => {
      console.log("add");
    },
    onRemove = () => {
      console.log("remove");
    },
    onLinkAction = (link) => {
      console.log("link:" + link);
    },
  } = props;

  if (_.isEmpty(nodeData)) {
    return null;
  }

  return (
    <div className="flex items-center">
      {nodeData.referer ? (
        <>
          <LinkOutlined className="m-1" />
          <Link
            href={nodeData.referer}
            className={cls(
              { "font-semibold": !!nodeData.children?.length },
              { "line-through text-slate-300": nodeData.disabled }
            )}
            onClick={(e) => {
              e.preventDefault();
              onLinkAction?.(nodeData.referer!);
            }}
          >
            {nodeData.title}
          </Link>
        </>
      ) : (
        <span
          className={cls(
            { "text-black": true },
            { "font-semibold": !!nodeData.children?.length },
            { "line-through text-slate-300": nodeData.disabled }
          )}
        >
          {nodeData.title}
        </span>
      )}
      <Space size={5} className="px-2">
        <Tooltip mouseEnterDelay={2} title="新增">
          <PlusCircleOutlined
            style={{ fontSize: 10 }}
            onClick={(e) => {
              e.preventDefault();
              onAdd?.(e);
            }}
          />
        </Tooltip>
        <Tooltip mouseEnterDelay={2} title="删除">
          <Popconfirm
            title="移除记录"
            description="记录移除不可恢复，请仔细确认..."
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okButtonProps={{ className: "bg-slate-800" }}
            onConfirm={() => {
              onRemove?.();
            }}
          >
            <MinusCircleOutlined style={{ fontSize: 10 }} />
          </Popconfirm>
        </Tooltip>
      </Space>
    </div>
  );
}
