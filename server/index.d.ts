import express from "express";
export interface Lwe8BlogConfig {
  blogTitle?: string;
  metadata?: {
    title?: string;
    keywords?: string[];
    description?: string;
  };
  appdir?: string;
  publicdir?: string;
  devserver?: {
    static?: string;
    port?: number;
    open?: boolean;
  };
  navbar?: Array<{ name: string; href: string }>;
}

export type Route = { resurl: string; filePath: string };
export type Routes = Route[];

declare const configPath: string;
declare const config: Lwe8BlogConfig;
declare const con: { default: Lwe8BlogConfig };
declare const converter: (filePath: string) => string;
declare const appDir: string;
declare const appPath: string;
declare const mdFiles: string[];
declare const fileName: (filePath: string) => string;
declare const routes: Routes;
declare const template: (content: string) => string;
declare const markdown: (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void;
