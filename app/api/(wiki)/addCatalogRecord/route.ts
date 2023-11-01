import { NextRequest, NextResponse } from "next/server";
import _ from "lodash";
import path from "path";
import { mkdir, readdir, writeFile } from "fs/promises";
import { IArticleConfig } from "@/app/_type/config";
import { ARTICLE_DIR } from "@/app/_constants";

/* 添加记录 */
export async function POST(request: NextRequest) {
  const reqBody: IArticleConfig = await request.json();

  if (_.isEmpty(reqBody.localDir)) {
    return Response.json({ code: -1, msg: "存储路径不能为空" });
  }

  if (reqBody.title?.includes("/")) {
    return Response.json({ code: -1, msg: "只支持一级路径" });
  }

  const existDirs = await readdir(ARTICLE_DIR, {
    encoding: "utf-8",
    recursive: true,
  }).then((dirs) => {
    return dirs.map((dir) => path.resolve(ARTICLE_DIR, dir));
  });
  if (existDirs.includes(reqBody.localDir!)) {
    return Response.json({ code: -1, msg: "存储路径已存在" });
  }

  try {
    await mkdir(reqBody.localDir!, { recursive: false });
    await Promise.all([
      writeFile(reqBody.localDir + "/README.md", "", { encoding: "utf-8" }),
      writeFile(
        reqBody.localDir + "/config.json",
        JSON.stringify(reqBody, null, 2),
        {
          encoding: "utf-8",
        }
      ),
    ]);
  } catch (error) {
    const errMsg = `--?> ${__filename}: ${error}`;
    console.error(errMsg);
    return NextResponse.json({ code: -1, msg: errMsg });
  }

  return Response.json({ code: 0, msg: "ok" });
}
