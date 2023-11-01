import { LOCAL_BASE_URL } from "@/app/_constants";

export const removeCatalogRecord = async (path: string) => {
  const res = await fetch(`${LOCAL_BASE_URL}/api/removeCatalogRecord`, {
    method: "POST",
    body: JSON.stringify({ path }),
  });
  return (await res.json()) as { code: number; msg: string };
};
