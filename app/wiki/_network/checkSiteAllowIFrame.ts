import axios from "axios";

/**
 * 判断网站地址是否支持 iframe 嵌入
 * @param url 网站地址, 例如 https://xxxx
 * @returns
 */
export const checkSiteAllowIFrame = async (url: string) => {
  try {
    const { headers } = await axios.get(url);
    if (
      Reflect.has(headers, "x-frame-options") &&
      Reflect.get(headers, "x-frame-options") === "SAMEORIGIN"
    ) {
      throw new Error("网站不支持 iframe 嵌入");
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
