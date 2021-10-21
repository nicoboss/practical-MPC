export = JIFFClient;
/**
 * Creates a new jiff client instance.
 * @class
 * @name JIFFClient
 * @param {!string} hostname - server hostname/ip and port.
 * @param {!string} computation_id - the id of the computation of this instance.
 * @param {?object} [options={}] - javascript object with additional options.
 *                           all parameters are optional, However, private and public key must either be both provided or neither of them provided.
 <pre>
 {
   "party_id": number,
   "party_count": number,
   "secret_key": Uint8Array to be used with libsodium-wrappers [(check Library Specs)]{@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html},
   "public_key": Uint8Array to be used with libsodium-wrappers [(check Library Specs)]{@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html},
   "public_keys": { 1: "Uint8Array PublicKey", 2: "Uint8Array PublicKey", ... },
   "Zp": default mod to use (prime number),
   "autoConnect": true/false,
   "hooks": { 'check out <a href="hooks.html">hooks documentation</a>' },
   "listeners" : A map from custom tags to listeners (of type function(sender_id, message_string)) that handle custom messages with that tag.
   "onConnect": function(jiff_instance),
   "onError": function(label, error): called when errors occured in client code or during handling requests from this client at the server side
                                      label is a string indicating where the error occured, and error is a string or an exception object.
   "safemod": boolean (whether or not to check if provided Zp is prime, may be slow for big primes, defaults to false),
   "crypto_provider": a boolean that flags whether to get beaver triplets and other preprocessing entities from the server (defaults to false),
   "socketOptions": an object, passed directly to socket.io constructor,
   "sodium": boolean, if false messages between clients will not be encrypted (useful for debugging),
   "maxInitializationRetries": how many consecutive times to retry to initialize with the server if initialization fails, defaults to 2,
   "preprocessingBatchSize": how many base level preprocessing tasks to execute in parallel.
 }
 </pre>
 *
 * @example
 * var JIFFClient = require('jiffClient'); // only for node.js
 * <script src="jiff-client.js"></script> // for the browser
 * // build a jiff instance which will connect to a server running on the local machine
 * var instance = new JIFFClient('http://localhost:8080', 'computation-1', {party_count: 2});
 */
declare function JIFFClient(hostname: string, computation_id: string, options?: object | null): void;
declare class JIFFClient {
    /**
     * Creates a new jiff client instance.
     * @class
     * @name JIFFClient
     * @param {!string} hostname - server hostname/ip and port.
     * @param {!string} computation_id - the id of the computation of this instance.
     * @param {?object} [options={}] - javascript object with additional options.
     *                           all parameters are optional, However, private and public key must either be both provided or neither of them provided.
     <pre>
     {
       "party_id": number,
       "party_count": number,
       "secret_key": Uint8Array to be used with libsodium-wrappers [(check Library Specs)]{@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html},
       "public_key": Uint8Array to be used with libsodium-wrappers [(check Library Specs)]{@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html},
       "public_keys": { 1: "Uint8Array PublicKey", 2: "Uint8Array PublicKey", ... },
       "Zp": default mod to use (prime number),
       "autoConnect": true/false,
       "hooks": { 'check out <a href="hooks.html">hooks documentation</a>' },
       "listeners" : A map from custom tags to listeners (of type function(sender_id, message_string)) that handle custom messages with that tag.
       "onConnect": function(jiff_instance),
       "onError": function(label, error): called when errors occured in client code or during handling requests from this client at the server side
                                          label is a string indicating where the error occured, and error is a string or an exception object.
       "safemod": boolean (whether or not to check if provided Zp is prime, may be slow for big primes, defaults to false),
       "crypto_provider": a boolean that flags whether to get beaver triplets and other preprocessing entities from the server (defaults to false),
       "socketOptions": an object, passed directly to socket.io constructor,
       "sodium": boolean, if false messages between clients will not be encrypted (useful for debugging),
       "maxInitializationRetries": how many consecutive times to retry to initialize with the server if initialization fails, defaults to 2,
       "preprocessingBatchSize": how many base level preprocessing tasks to execute in parallel.
     }
     </pre>
     *
     * @example
     * var JIFFClient = require('jiffClient'); // only for node.js
     * <script src="jiff-client.js"></script> // for the browser
     * // build a jiff instance which will connect to a server running on the local machine
     * var instance = new JIFFClient('http://localhost:8080', 'computation-1', {party_count: 2});
     */
    constructor(hostname: string, computation_id: string, options?: object | null);
    /**
     * The server hostname, ends with a slash, includes port and protocol (http/https).
     * @type {!string}
     */
    hostname: string;
    /**
     * Stores the computation id.
     * @type {!string}
     */
    computation_id: string;
    /**
     * Private. Do not use directly externally; use isReady() instead.
     * @type {!boolean}
     * @see {@link module:jiff-client~JIFFClient#isReady}
     */
    __ready: boolean;
    /**
     * Private. Do not use directly externally; use isInitialized() instead.
     * @type {!boolean}
     * @see {@link module:jiff-client~JIFFClient#isInitialized}
     */
    __initialized: boolean;
    /**
     * Returns whether this instance is capable of starting the computation.
     * In other words, the public keys for all parties and servers are known,
     * and this party successfully initialized with the server.
     * @returns {!boolean}
     */
    isReady: () => boolean;
    /**
     * Returns whether this instance initialized successfully with the server.
     * Note that this can be true even when isReady() returns false, in case where some other parties have not
     * initialized yet!
     * @returns {!boolean}
     */
    isInitialized: () => boolean;
    /**
     * Helper functions [DO NOT MODIFY UNLESS YOU KNOW WHAT YOU ARE DOING].
     * @type {!helpers}
     */
    helpers: (jiffClient: any) => void;
    /**
     * Shallow copy of the options passed to the constructor.
     * @type {!Object}
     */
    options: any;
    /**
     * The default Zp for this instance.
     * @type {!number}
     */
    Zp: number;
    /**
     * The id of this party.
     * @type {number}
     */
    id: number;
    /**
     * Total party count in the computation, parties will take ids between 1 to party_count (inclusive).
     * @type {number}
     */
    party_count: number;
    /**
     * sodium wrappers either imported via require (if in nodejs) or from the bundle (in the browser).
     * This will be false if options.sodium is false.
     * @see {@link https://www.npmjs.com/package/libsodium-wrappers}
     * @type {?sodium}
     */
    sodium_: any;
    /**
     * A map from party id to public key. Where key is the party id (number), and
     * value is the public key, which by default follows libsodium's specs (Uint8Array).
     * @see {@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html}
     * @type {!object}
     */
    keymap: object;
    /**
     * The secret key of this party, by default this follows libsodium's specs.
     * @see {@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html}
     * @type {?Uint8Array}
     */
    secret_key: Uint8Array | null;
    /**
     * The public key of this party, by default this follows libsodium's specs.
     * @see {@link https://download.libsodium.org/doc/public-key_cryptography/authenticated_encryption.html}
     * @type {?Uint8Array}
     */
    public_key: Uint8Array | null;
    /**
     * Flags whether to use the server as a fallback for objects that were not pre-processed properly
     * @type {!boolean}
     */
    crypto_provider: boolean;
    /**
     * Stores messages that are received with a signature prior to acquiring the public keys of the sender.
     * { 'party_id': [ { 'label': 'share/open/custom', <other attributes of the message> } ] }
     * @type {object}
     */
    messagesWaitingKeys: object;
    /**
     * A map from tags to listeners (functions that take a sender_id and a string message).
     *
     * Stores listeners that are attached to this JIFF instance, listeners listen to custom messages sent by other parties.
     * @type {!object}
     */
    listeners: object;
    /**
     * Stores custom messages that are received before their listeners are set. Messages are stored in order.
     * { 'tag' => [ { "sender_id": <sender_id>, "message": <message> }, ... ] }
     *
     * Once a listener has been set, the corresponding messages are sent to it in order.
     * @type {!object}
     */
    custom_messages_mailbox: object;
    /**
     * Stores all promises created within some barrier.
     * @type {!object}
     */
    barriers: object;
    /**
     * Stores the parties and callbacks for every .wait_for() registered by the user.
     * @type {!Array}
     */
    wait_callbacks: any[];
    /**
     * Counts how many times JIFF attempted to initialize with the server
     * without success consecutively.
     * @type {!number}
     *
     */
    initialization_counter: number;
    /**
     * Utility functions
     * @type {!utils}
     */
    utils: (jiffClient: any) => void;
    /**
     * An array containing the names (jiff-client-[name].js) of the extensions that are
     * applied to this instance.
     * @type {string[]}
     */
    extensions: string[];
    /**
     * Internal helpers for operations inside/on a share. Modify existing helpers or add more in your extensions
     * to avoid having to re-write and duplicate the code for primitives.
     * @type {!object}
     */
    share_helpers: object;
    /**
     * The constructor function used by JIFF to create a new share. This can be overloaded by extensions to create custom shares.
     * Modifying this will modify how shares are generated in the BASE JIFF implementation.
     * A share is a value/promise wrapped with a share object.
     * A share also has methods for performing operations.
     * @constructor
     * @param {number|promise} value - the value of the share, or a promise to it.
     * @param {Array} holders - the parties that hold all the corresponding shares (must be sorted).
     * @param {number} threshold - the min number of parties needed to reconstruct the secret.
     * @param {number} Zp - the mod under which this share was created.
     *
     * @example
     * // A share whose value is 10: the secret is still unknown, 10 is only one share
     * var share = new jiffClient.SecretShare(10, [1, 2, 3], 3, jiffClient.Zp);
     *
     * @example
     * // A share whose value depends on some promise
     * var share = new jiffClient.SecretShare(promise, [1, 2, 3, 4], 4, jiffClient.Zp);
     */
    SecretShare: any;
    /**
     * A collection of useful protocols to be used during computation or preprocessing: extensions are encouraged to add useful
     * common protocols here, under a sub namespace corresponding to the extension name.
     * @type {!protocols}
     */
    protocols: any;
    /**
     * Stores pre-computed values (beaver triples, random bits, etc) used to aid/speed up the main processes.
     * @type {!object}
     */
    preprocessing_table: object;
    /**
     * Sets batch size for base level preprocessing tasks
     * @type {!Number}
     */
    preprocessingBatchSize: number;
    /**
     * maps all primitive operations to the other operations they are dependent on, until leaves are primitives for which preprocessing protocols are defined,
     * this map is traversed during preprocessing to guide preprocessing of high level operations. Extensions should modify this map to reflect
     * any required changes to preprocessing of modified primitives
     * @type {!object}
     */
    preprocessing_function_map: object;
    /**
     * Store the default preprocessing protocols for each type of preprocessing value
     * @type {!object}
     */
    default_preprocessing_protocols: object;
    /**
     * Stores currently executing preprocessing tasks.
     * @type {!linkedlist}
     */
    currentPreprocessingTasks: any;
    /**
     * Callback to execute when preprocessing is done!
     * @type {?function}
     */
    preprocessingCallback: Function | null;
    /**
     * Used for logging/debugging
     * @type {!Array}
     */
    logs: any[];
    /**
     * A map from open operation id to the corresponding shares received for that open operation
     * @type {!object}
     */
    shares: object;
    /**
     * A map from some message operation id to a deferred resolved when that message is received.
     * @type {!object}
     */
    deferreds: object;
    /**
     * Store sharing and shares counter which keeps track of the count of
     * sharing operations (share and open) and the total number of shares
     * respectively (used to get a unique id for each share operation and
     * share object).
     * @type {!object}
     */
    counters: object;
    /**
     * A prefix attached to all op_ids, can be changed using {@link module:jiff-client~JIFFClient#seed_ids}
     * to guarantee uniqueness of auto generate ids in a user-side callback
     * or event handler.
     * @type {string}
     * @see {@link module:jiff-client~JIFFClient#seed_ids}
     */
    op_id_seed: string;
    /**
     * The hooks for this instance.
     * Checkout the <a href="hooks.html">hooks documentation</a>
     * @type {!hooks}
     */
    hooks: any;
    /**
     * Contains handlers for communication events
     * @type {!handlers}
     */
    handlers: (jiffClient: any) => void;
    socketConnect: (JIFFClientInstance: any) => void;
    /**
     * Connect to the server and starts listening.
     */
    connect: () => void;
}
