/// <reference types="vite/client" />

declare const __SITE_ORIGIN__: string;
declare const __CONTACT_ENDPOINT__: string;

declare module "*.svg?raw" {
    const content: string;
    export default content;
}
