export = Hooks;
declare function Hooks(jiffClient: any): void;
declare class Hooks {
    constructor(jiffClient: any);
    jiffClient: any;
    /**
     * Hook for computing shares of a secret
     * @method computeShares
     * @memberof hooks
     * @param jiffClient {module:jiff-client~JIFFClient} - the jiff client instance
     * @param secret {number} - the secret to share
     * @param parties_list {number[]} - array of party ids to share with
     * @param threshold {number} - threshold of sharing
     * @param Zp {number} - the field prime
     */
    computeShares: (jiff: any, secret: number, parties_list: any[], threshold: number, Zp: number) => any;
    reconstructShare: (jiff: any, shares: any[]) => number;
    encryptSign(jiffClient: any, message: any, ...args: any[]): any;
    decryptSign(jiffClient: any, cipher: any, ...args: any[]): any;
    generateKeyPair(jiffClient: any): {
        public_key: any;
        secret_key: any;
    };
    parseKey(jiffClient: any, keyString: any): Uint8Array | "";
    dumpKey(jiffClient: any, key: any): string;
    beforeShare: any[];
    afterComputeShare: any[];
    receiveShare: any[];
    beforeOpen: any[];
    receiveOpen: any[];
    afterReconstructShare: any[];
    createSecretShare: any[];
    beforeOperation: any[];
    afterOperation: ((jiff: any, label: any, msg: any) => any)[];
    /**
     * Execute all hooks attached to the given name in order.
     * Hooks are executed sequentially such that the first hook's return value is passed into the second and so on.
     * @method execute_array_hooks
     * @memberof hooks
     * @param {string} hook_name - the name of the hook
     * @param {Array} params - parameters to pass to the hooks
     * @param {number} acc_index - the index in params in which the result of the hooks must be saved, if no hooks
     *                             exist for the name, then params[acc_index] is returned.
     * @return {object} returns the result of the last hook.
     */
    execute_array_hooks(hook_name: string, params: any[], acc_index: number): object;
}
