"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import cls from "classnames";
import Link from "next/link";

type IHeaderProps = {
  title?: string;
  img?: string | StaticImageData;
  tabs?: { name: string; href: string }[];
  height?: number; // Header行高
  style?: React.CSSProperties;
  className?: string;
};

export default function Header(props: IHeaderProps) {
  const { title = "", tabs = [], height = 40 } = props;

  return (
    <div
      className={cls(
        "flex items-center justify-start",
        "bg-gradient-to-r from-blue-950 to-blue-900",
        props.className
      )}
      style={{
        width: "100%",
        height,
        ...props.style,
      }}
    >
      <div className="flex items-center px-8">
        {props.img ? (
          <Image
            src={props.img}
            alt="logo"
            width={height}
            height={height}
            style={{ padding: "0 10px" }}
          />
        ) : null}
        <span className="text-base text-white">{props.title}</span>
      </div>
      {tabs.map(({ href, name }) => (
        <Link
          key={name}
          href={href}
          className="text-white px-3 hover:underline hover:underline-offset-4"
        >
          {name}
        </Link>
      ))}
    </div>
  );
}
