export = JIFFServer;
declare function JIFFServer(http: any, options: any): void;
declare class JIFFServer {
    constructor(http: any, options: any);
    options: any;
    http: any;
    sodium: any;
    computationMaps: {
        clientIds: {};
        spareIds: {};
        maxCount: {};
        keys: {};
        secretKeys: {};
        freeParties: {};
    };
    socketMaps: {
        socketId: {};
        computationId: {};
        partyId: {};
    };
    mailbox: {};
    extensions: any[];
    computation_instances_map: {};
    computation_instances_deferred: {};
    hooks: Hooks;
    cryptoMap: {};
    cryptoProviderHandlers: CryptoProviderHandlers;
    initComputation(computation_id: any, party_id: any, party_count: any): void;
    freeComputation(computation_id: any): void;
    repr(): {} & JIFFServer;
    helpers: typeof helpers;
}
import Hooks = require("./server/hooks.js");
import CryptoProviderHandlers = require("./server/cryptoprovider.js");
import helpers = require("./common/helpers.js");
