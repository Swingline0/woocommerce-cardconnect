interface APIEndpointStruct {
    basePath: string;
    cs: string;
    itoke: string;
}

// Global config object provided via wp_localize_script
export interface WoocommerceCardConnectSettings {
    isLive: boolean;
    profilesEnabled: boolean;
    apiEndpoint: APIEndpointStruct;
    allowedCards: Array<String>;
    userSignedIn: boolean;
    isIframeApiEnabled: boolean;
}

export interface ICardConnectResponse {
    action: string;
    data: string;
}

export interface JQueryGlobal extends JQueryStatic {
    payment: any;
}
