export = ServerHooks;
declare function ServerHooks(jiffServer: any): void;
declare class ServerHooks {
    constructor(jiffServer: any);
    jiff: any;
    log(jiff: any, ...args: any[]): void;
    beforeInitialization: ((jiff: any, computation_id: any, msg: any, params: any) => any)[];
    afterInitialization: any[];
    beforeOperation: any[];
    afterOperation: any[];
    onDisconnect: any[];
    beforeFree: any[];
    afterFree: any[];
    trackFreeIds(jiff: any, party_count: any): {
        val: {
            start: any;
            end: any;
        }[];
        is_free(point: any): boolean;
        reserve(point: any): boolean;
        create_free(): any;
    };
    onInitializeUsedId(jiff: any, computation_id: any, party_id: any, party_count: any, msg: any): any;
    computeShares: typeof shamir_share.jiff_compute_shares;
    generateKeyPair(jiff: any): {
        public_key: any;
        secret_key: any;
    };
    parseKey(jiff: any, keyString: any): Uint8Array | "";
    dumpKey(jiff: any, key: any): string;
    putInMailbox: (jiff: any, label: any, msg: any, computation_id: any, to_id: any) => any;
    getFromMailbox: (jiff: any, computation_id: any, party_id: any) => {
        id: any;
        label: any;
        msg: any;
    }[];
    removeFromMailbox: (jiff: any, computation_id: any, party_id: any, mailbox_pointer: any) => void;
    sliceMailbox: (jiff: any, computation_id: any, party_id: any, mailbox_pointer: any) => void;
    execute_array_hooks(hook_name: any, params: any, acc_index: any): any;
}
import shamir_share = require("../client/protocols/shamir/share.js");
