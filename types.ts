export type NewsType = {
  title: string
  url: string
  img: string
  metadata: {
    favicon: string
    website: string
    time_added: string
  }
}

export type SavedNewsType = NewsType & {
  content: string
}


export enum NewsViewMode {
  WEBVIEW = 'WEBVIEW',
  MDX = 'MDX',
}