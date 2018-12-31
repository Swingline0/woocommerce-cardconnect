interface APIEndpointStruct {
  basePath: string;
  cs: string;
  itoke: string;
}

interface IframeOptionsStruct {
  enabled: boolean;
  autostyle: boolean;
  formatinput: boolean;
  tokenizewheninactive: boolean;
}

// Global config object provided via wp_localize_script
export interface WoocommerceCardConnectSettings {
  isLive: boolean;
  profilesEnabled: boolean;
  apiEndpoint: APIEndpointStruct;
  allowedCards: Array<String>;
  userSignedIn: boolean;
  iframeOptions: IframeOptionsStruct;
}

export interface ICardConnectResponse {
  action: string;
  data: string;
}

export interface JQueryGlobal extends JQueryStatic {
  payment: any;
}
