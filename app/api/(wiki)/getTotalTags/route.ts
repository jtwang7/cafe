import { ARTICLE_DIR } from "@/app/_constants";
import { IArticleConfig } from "@/app/_type/config";
import { readdir, readFile } from "fs/promises";
import { NextResponse } from "next/server";
import _ from "lodash";
import path from "path";

/* 获取储备的所有标签 */
export async function GET() {
  try {
    /* 获取所有config.json文件 */
    const folders = await readdir(ARTICLE_DIR, {
      recursive: true,
      withFileTypes: true,
      encoding: "utf-8",
    });
    const files: string[] = [];
    for (const item of folders) {
      if (item.name !== "config.json") continue;
      files.push(path.resolve(item.path, item.name));
    }

    const tags = await Promise.all(
      files.map((file) => readFile(file, { encoding: "utf-8" }))
    ).then((list) =>
      list.map((c) => {
        const config = JSON.parse(c) as IArticleConfig;
        return config.tags ?? [];
      })
    );
    const uniqTags = _.uniq(_.flatMapDeep(tags));

    return NextResponse.json({ code: 0, data: uniqTags });
  } catch (error) {
    return NextResponse.json({ code: -1, msg: error });
  }
}
