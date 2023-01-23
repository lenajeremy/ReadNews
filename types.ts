export type NewsType = {
  title: string
  url: string
  img: string
  metadata: {
    favicon: string
    website: string
  }
}


export enum NewsViewMode {
  WEBVIEW = 'WEBVIEW',
  MDX = 'MDX',
}