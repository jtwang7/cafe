"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import cls from "classnames";
import { useBoolean } from "ahooks";
import _ from "lodash";
import { useSWRConfig } from "swr";
import axiosInstance from "../_lib/axios";
import {
  Cascader,
  Tree,
  Segmented,
  SegmentedProps,
  Flex,
  Drawer,
  ConfigProvider,
  message,
  Spin,
  Empty,
} from "antd";
import {
  BarsOutlined,
  DesktopOutlined,
  DownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { SegmentedValue } from "antd/es/segmented";
import TreeNode from "./_components/TreeNode";
import { theme } from "./theme";
import CatalogForm from "./_components/CatalogForm";
import { IArticleData } from "../_type/config";
import { useGetCatalog } from "./_fetchers/useGetCatalog";

export default function WikiPage() {
  const { mutate } = useSWRConfig();
  const { catalog, isCatalogFetchLoading, catalogKey } = useGetCatalog();

  /* 监听 ⌘+k 聚焦搜索框 */
  const cascaderRef = useRef<any>(null);
  useLayoutEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        console.log("聚焦搜索");
        cascaderRef.current.focus();
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  /* 当前树节点 */
  const [currentNode, setCurrentNode] = useState<IArticleData[0]>();

  /* tabs 切换 */
  const [curSegmented, setSegmented] = useState<SegmentedValue>("total");
  const onSegmentedChange: SegmentedProps["onChange"] = (value) => {
    setSegmented(value);
  };
  const [drawerOpen, { setTrue: setDrawerOpen, setFalse: setDrawerClose }] =
    useBoolean(false);
  const segmentedMap = {
    total: () => (
      <Tree
        showLine
        blockNode
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        fieldNames={{ key: "_id" }}
        treeData={catalog as any}
        titleRender={(nodeData: any) => (
          <TreeNode
            nodeData={nodeData}
            onAdd={() => {
              setDrawerOpen();
              setCurrentNode(nodeData);
            }}
            onRemove={async () => {
              try {
                await axiosInstance.post("/api/removeCatalogRecord", {
                  path: nodeData.localDir,
                });
                mutate(catalogKey);
              } catch (error) {
                message.error("记录移除失败");
              }
            }}
          />
        )}
      />
    ),
    web: () => null,
    local: () => null,
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="h-full flex">
        {/* 侧边栏 */}
        <div
          className={cls(
            "h-full basis-1/5 p-3 relative",
            "border-r border-slate-200"
          )}
        >
          <div className="w-full mb-3">
            <Cascader
              ref={cascaderRef}
              style={{ width: "100%" }}
              placeholder="聚焦搜索 (⌘ + k)"
              size="middle"
              options={catalog}
              fieldNames={{ label: "title", value: "title" }}
              disabled={isCatalogFetchLoading}
              showSearch={{
                filter: (inputValue, path) =>
                  path.some(
                    (option) =>
                      (option.title as string)
                        .toLowerCase()
                        .indexOf(inputValue.toLowerCase()) > -1
                  ),
              }}
            />
          </div>
          <Spin
            tip="🌀 加载中..."
            spinning={isCatalogFetchLoading}
            className="bg-white"
          >
            {_.isEmpty(catalog) ? (
              <Empty />
            ) : (
              <Flex vertical gap="small" className="w-full">
                <Segmented
                  block
                  onChange={onSegmentedChange}
                  value={curSegmented}
                  options={[
                    {
                      label: "全部",
                      value: "total",
                      icon: <BarsOutlined />,
                    },
                    {
                      label: "线上",
                      value: "web",
                      icon: <DesktopOutlined />,
                    },
                    {
                      label: "本地",
                      value: "local",
                      icon: <HomeOutlined />,
                    },
                  ]}
                />
                {Reflect.get(segmentedMap, curSegmented)?.() ?? null}
              </Flex>
            )}
          </Spin>
          <Drawer
            title={null}
            height={600}
            placement="bottom"
            closable={false}
            onClose={setDrawerClose}
            open={drawerOpen}
            getContainer={false}
            destroyOnClose={true}
          >
            <CatalogForm
              node={currentNode}
              onSave={() => {
                setDrawerClose();
                setCurrentNode(undefined);
                mutate(catalogKey);
              }}
            />
          </Drawer>
        </div>
        {/* 主视图 */}
        <div className={cls("h-full flex-auto")}>
          <div className="h-full bg-black p-3"></div>
        </div>
      </div>
    </ConfigProvider>
  );
}
