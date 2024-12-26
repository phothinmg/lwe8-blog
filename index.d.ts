export function server(): void;
export type Metadata = {
    title?: string | undefined;
    keywords?: string[] | undefined;
    description?: string | undefined;
};
export type DevServer = {
    port?: number | undefined;
    open?: boolean | undefined;
};
export type Lwe8BlogConfig = {
    blogTitle?: string | undefined;
    metadata?: Metadata | undefined;
    appdir?: string | undefined;
    navbar?: {
        name: string;
        href: string;
    }[] | undefined;
    publicDir?: string | undefined;
    devserver?: DevServer | undefined;
};
export type Route = {
    resurl: string;
    filePath: string;
};
export type Routes = Route[];
