declare module "xss" {
  export type Option = {
    whiteList?: Record<string, string[]>;
    stripIgnoreTag?: boolean;
    stripIgnoreTagBody?: string[];
  };
  const xss: (html: string, option?: Option) => string;
  export = xss;
}
