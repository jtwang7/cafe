import { LOCAL_BASE_URL } from "@/app/_constants";
import { IArticleConfig } from "@/app/_type/config";

export default async function addCatalogRecord(body: IArticleConfig) {
  const _r = await fetch(`${LOCAL_BASE_URL}/api/addCatalogRecord`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const res = await _r.json();
  return res as { code: number; msg: string };
}
