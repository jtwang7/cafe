import { PlusOutlined } from "@ant-design/icons";
import { useBoolean, useControllableValue } from "ahooks";
import { Input, InputRef, Space, Tag, Tooltip, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { COLOR_BARS_SEMEANTIC } from "@/app/_constants";

type IArticleTagsProps = {
  defaultTags?: string[];
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  allowedEdit?: boolean;
  onTagClick?: (tag: string) => void;
};

export default function ArticleTags(props: IArticleTagsProps) {
  const { defaultTags, tags, onTagsChange, allowedEdit = true } = props;

  const tagInputStyle = {
    width: 64,
    height: 22,
    marginInlineEnd: 8,
    verticalAlign: "top",
  };

  const inputRef = useRef<InputRef | null>(null);
  const editInputRef = useRef<InputRef | null>(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(-1);
  const [currentEditValue, setCurrentEditValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputVisible, { setTrue: showInput, setFalse: hiddenInput }] =
    useBoolean(false);

  const [innerTags, setInnerTags] = useControllableValue<string[]>(props, {
    defaultValue: [],
    defaultValuePropName: "defaultTags",
    valuePropName: "tags",
    trigger: "onTagsChange",
  });

  const handleEditInputConfirm = () => {
    setInnerTags((tags) => {
      const newTags = [...tags];
      newTags[currentEditIndex] = currentEditValue;
      return newTags;
    });
    setCurrentEditIndex(-1);
    setCurrentEditValue("");
  };

  const handleInputConfirm = () => {
    if (innerTags.includes(inputValue)) {
      message.warning("标签已存在");
    }
    if (_.isEmpty(inputValue)) {
      message.warning("标签不能为空");
    }
    if (inputValue && !innerTags.includes(inputValue)) {
      setInnerTags((tags) => [...tags, inputValue]);
    }
    hiddenInput();
    setInputValue("");
  };

  const handleClose = (removedTag: string) => {
    setInnerTags((tags) => {
      const newTags = tags.filter((tag) => tag !== removedTag);
      return newTags;
    });
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    if (currentEditValue) {
      editInputRef.current?.focus();
    }
  }, [currentEditValue]);

  return (
    <Space size={[0, 8]} wrap>
      {innerTags.map((tag, index) => {
        if (allowedEdit && currentEditIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              style={tagInputStyle}
              value={currentEditValue}
              onChange={(e) => {
                setCurrentEditValue(e.target.value);
              }}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            className="hover:cursor-pointer"
            closable={allowedEdit}
            color={COLOR_BARS_SEMEANTIC[index % COLOR_BARS_SEMEANTIC.length]}
            style={{ userSelect: "none" }}
            onClose={() => handleClose(tag)}
            onClick={(e) => {
              e.preventDefault();
              props.onTagClick?.(tag);
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              if (allowedEdit) {
                setCurrentEditIndex(index);
                setCurrentEditValue(tag);
              }
            }}
          >
            <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {allowedEdit ? (
        inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={tagInputStyle}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            className="bg-slate-50 border-dashed h-[22px]"
            icon={<PlusOutlined />}
            onClick={showInput}
          >
            New Tag
          </Tag>
        )
      ) : null}
    </Space>
  );
}
