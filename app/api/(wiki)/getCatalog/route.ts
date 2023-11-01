/* 获取目录树 */
import fs from "fs";
import path from "path";
import _ from "lodash";
import { ARTICLE_DIR } from "@/app/_constants";
import { IArticleConfig, IArticleData } from "@/app/_type/config";

async function dfs(nodePath: string, tree: IArticleData = []) {
  try {
    const fnames = fs.readdirSync(nodePath, {
      encoding: "utf-8",
      recursive: false,
    });
    const dirs = fnames.map((name) => path.join(nodePath, name));
    const configPath = dirs.find((dir) => {
      return fs.statSync(dir).isFile() && dir.endsWith("config.json");
    });
    const foldersPath = dirs.filter((dir) => fs.statSync(dir).isDirectory());
    if (!configPath) {
      throw new Error("config.json not found");
    }
    /* 优先读取配置文件构建父节点 */
    const configData: IArticleConfig = JSON.parse(
      fs.readFileSync(configPath, { encoding: "utf-8" })
    );
    const node: IArticleData[0] = {
      ...configData,
      children: [],
    };
    tree.push(node);
    /* 递归遍历子文件夹 */
    if (!foldersPath.length) {
      return;
    }
    for (const folderPath of foldersPath) {
      dfs(folderPath, node.children);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function GET() {
  try {
    const res: IArticleData = [];
    await dfs(ARTICLE_DIR, res);
    return Response.json({ code: 0, data: res });
  } catch (error) {
    return Response.json({ code: -1, msg: error });
  }
}
