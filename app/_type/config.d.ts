export interface IArticleConfig {
  _id?: string; // 唯一标识
  title?: string; // 标题
  tags?: string[]; // 标签
  referer?: string; // 外部链接
  localDir?: string; // 文件本地路径
  disabled?: boolean; // 禁用
}

export type IArticleData = Array<IArticleConfig & { children?: IArticleData }>;
