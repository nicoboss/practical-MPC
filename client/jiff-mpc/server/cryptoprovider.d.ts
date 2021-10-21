export = CryptoProviderHandlers;
declare function CryptoProviderHandlers(jiffServer: any): void;
declare class CryptoProviderHandlers {
    constructor(jiffServer: any);
    triplet(jiff: any, computation_id: any, receivers_list: any, threshold: any, Zp: any, params: any): {
        secrets: any[];
    };
    quotient(jiff: any, computation_id: any, receivers_list: any, threshold: any, Zp: any, params: any): {
        secrets: any[];
    };
    numbers(jiff: any, computation_id: any, receivers_list: any, threshold: any, Zp: any, params: any): {
        secrets: any[];
    };
}
