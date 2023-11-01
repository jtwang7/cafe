"use client";

import { IArticleConfig, IArticleData } from "@/app/_type/config";
import { Button, Divider, Flex, Input, Tooltip, message } from "antd";
import React, { useCallback } from "react";
import _ from "lodash";
import { useImmerReducer } from "use-immer";
import ArticleTags from "./ArticleTags";
import { QuestionCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { v4 } from "uuid";
import addCatalogRecord from "../_network/addCatalogRecord";
import { useGetTotalTags } from "../_fetchers/useGetTotalTags";

export interface IState {
  path: string;
  referer: string;
  tags: string[];
}
export type IActionType =
  | { type: "setPath"; path: string }
  | { type: "setReferer"; referer: string }
  | { type: "setTags"; tags: string[] }
  | { type: "addTag"; tag: string };

export type ICatalogFormProps = {
  node?: IArticleData[0];
  onSave?: () => void;
};
export default function CatalogForm(props: ICatalogFormProps) {
  const { onSave = () => {}, node } = props;

  const { tags: existTags, isTagsLoading: isExistTagsLoading } =
    useGetTotalTags();

  /* 状态 */
  const initialState: IState = {
    path: "",
    referer: "",
    tags: [],
  };
  const [state, dispatch] = useImmerReducer<IState, IActionType>(
    (draft, action) => {
      switch (action.type) {
        case "setPath":
          draft.path = action.path;
          break;
        case "setReferer":
          draft.referer = action.referer;
          break;
        case "setTags":
          draft.tags = action.tags;
          break;
        case "addTag":
          if (!draft.tags.includes(action.tag)) {
            draft.tags.push(action.tag);
          }
          break;
        default:
          break;
      }
    },
    initialState
  );

  /* 保存 */
  const save = useCallback(
    async (state: IState, parentPath: string) => {
      const localDir = parentPath + "/" + state.path;
      const reqBody: IArticleConfig = {
        _id: v4(),
        title: state.path,
        tags: state.tags,
        referer: state.referer,
        localDir,
        disabled: false,
      };
      const { code } = await addCatalogRecord(reqBody);
      if (code === 0) {
        message.success("保存成功");
      } else {
        message.error("保存失败");
      }
      onSave?.();
    },
    [onSave]
  );

  return (
    <Flex vertical gap="small">
      <Divider orientation="left" style={{ margin: 0 }}>
        <span className="text-xs">基础信息</span>
      </Divider>
      <Flex gap="small">
        <Input
          size="small"
          className="w-full"
          placeholder="请输入存储路径"
          value={state.path}
          addonBefore={node?.title}
          onChange={(e) => {
            dispatch({ type: "setPath", path: e.target.value });
          }}
        />
        <Tooltip title="必填">
          <QuestionCircleOutlined />
        </Tooltip>
      </Flex>
      <Flex gap="small">
        <Input
          size="small"
          className="w-full"
          placeholder="请输入外部链接"
          value={state.referer}
          onChange={(e) => {
            dispatch({ type: "setReferer", referer: e.target.value });
          }}
        />
        <Tooltip title="可选">
          <QuestionCircleOutlined />
        </Tooltip>
      </Flex>
      <Divider orientation="left" style={{ margin: 0 }}>
        <span className="text-xs">标签</span>
      </Divider>
      <ArticleTags
        allowedEdit
        tags={state.tags}
        onTagsChange={(tags) => {
          dispatch({ type: "setTags", tags });
        }}
      />
      <div className="rounded-md shadow-inner bg-slate-50 p-2">
        {isExistTagsLoading ? null : (
          <ArticleTags
            allowedEdit={false}
            defaultTags={existTags}
            onTagClick={(tag) => {
              dispatch({ type: "addTag", tag });
            }}
          />
        )}
      </div>
      <Divider style={{ margin: 4 }} />
      <Button
        block
        className="bg-slate-800"
        type="primary"
        icon={<SaveOutlined />}
        onClick={() => {
          save(state, node?.localDir ?? "");
        }}
      >
        保存
      </Button>
    </Flex>
  );
}
