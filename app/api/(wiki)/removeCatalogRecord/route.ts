import { NextRequest, NextResponse } from "next/server";
import { rm, access, constants } from "fs/promises";

export type IRequestBody = {
  path: string;
};
export async function POST(request: NextRequest) {
  const body: IRequestBody = await request.json();
  const { path } = body;
  try {
    await access(path, constants.F_OK);
    await rm(path, { recursive: true, force: true });
  } catch (error) {
    console.error("---?> removeCatalogRecord", error);
    return NextResponse.json({ code: -1, msg: "remove error" });
  }

  return NextResponse.json({ code: 0, msg: "ok" });
}
