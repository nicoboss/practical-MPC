/** The modulos to be used in secret sharing and operations on shares. */
/** The length of RSA key in bits. */
export var RSA_bits: number;
/** Size of the Passphrase used in generating an RSA key */
export var passphrase_size: number;
/**
 * The interface defined by an instance of jiff.
 * You can get an instance of jiff by calling function {@link jiff.make_jiff}.
 * You can access any of the specified members of function with &lt;jiff-instance&gt;.&lt;member-name&gt;.
 * @namespace jiff-instance
 * @memberof jiff
 * @version 1.0
 */
/**
 * Create a new jiff instance.
 * @memberof jiff
 * @function make_jiff
 * @instance
 * @param {string} hostname - server hostname/ip and port.
 * @param {string} computation_id - the id of the computation of this instance.
 * @param {object} options - javascript object with additonal options [optional],
 *                           all parameters are optional, However, for predefined public keys to work all
 *                           of "party_id", "secret_key", and "public_keys" should be provided.
<pre>
{
  "triplets_server": "http://hostname:port",
  "numbers_server": "http://hostname:port",
  "keys_server": "http://hostname:port",
  "party_id": number,
  "party_count": number,
  "secret_key": &lt;RSAKey&gt; [(check Cryptico Library)]{@link https://github.com/wwwtyro/cryptico},
  "public_keys": { 1: "ascii-armored-key1", 2: "ascii-armored-key2", ... }
}
</pre>
 *
 * @returns {jiff-instance} the jiff instance for the described computation.
 *                          The Jiff instance contains the socket, number of parties, functions
 *                          to share and perform operations, as well as synchronization flags.
 *
 */
export function make_jiff(hostname: string, computation_id: string, options: object): {};
/**
 * Mod instead of javascript's remainder (%).
 * @memberof jiff
 * @function mod
 * @instance
 * @param {number} x
 * @param {number} y
 * @return {number} x mod y.
 */
export function mod(x: number, y: number): number;
/** Randomly generate a string of size length */
export function random_string(length: any): string;
/** Compute the log to a given base (2 by default). */
export function bLog(value: any, base: any): number;
/**
 * Get the party number from the given party_id, the number is used to compute/open shares.
 * If party id was a number (regular party), that number is returned,
 * If party id referred to the ith server, then party_count + i is returned (i > 0).
 * @param {number} party_count - the party count (how many non server parties).
 * @param {number/string} party_id - the party id from which to compute the number.
 * @return {number} the party number (> 0).
 */
export function get_party_number(party_count: number, party_id: any): number;
/**
 * Encrypts and signs the given message, the function will execute message.toString(10)
 * internally to ensure type of message is a string before encrypting.
 * @param {number} message - the message to encrypt.
 * @param {string} encryption_public_key - ascii-armored public key to encrypt with.
 * @param {RSAKey} signing_private_key - the private key of the encrypting party to sign with.
 * @param {boolean} is_string - set to true if message is a string, defaults to false [optional].
 * @returns {String} the signed cipher text.
 */
export function encrypt_and_sign(message: number, encryption_public_key: string, signing_private_key: any, is_string: boolean): string;
/**
 * Decrypts and checks the signature of the given ciphertext, the function will execute
 * parseInt internally to ensure returned value is a number.
 * @param {number} cipher_text - the ciphertext to decrypt.
 * @param {RSAKey} decryption_secret_key - the secret key to decrypt with.
 * @param {string} signing_public_key - ascii-armored public key to verify against signature.
 * @param {boolean} is_string - set to true if decrypted message is expected to be a string, defaults to false [optional].
 * @returns {number} the decrypted message if the signature was correct.
 * @throws error if signature was forged/incorrect.
 */
export function decrypt_and_sign(cipher_text: number, decryption_secret_key: any, signing_public_key: string, is_string: boolean): number;
/**
 * Share given secret to the participating parties.
 * @param {jiff-instance} jiff - the jiff instance.
 * @param {number} secret - the secret to share.
 * @param {number} threshold - the minimimum number of parties needed to reconstruct the secret, defaults to all the recievers [optional].
 * @param {array} receivers_list - array of party ids to share with, by default, this includes all parties [optional].
 * @param {array} senders_list - array of party ids to receive from, by default, this includes all parties [optional].
 * @param {number} Zp - the modulos (if null global gZp will be used) [optional].
 * @returns {object} a map where the key is the sender party id
 *          and the value is the share object that wraps
 *          what was sent from that party (the internal value maybe deferred).
 *          if the party that calls this function is not a receiver then the map
 *          will be empty.
 */
export function jiff_share(jiff: any, secret: number, threshold: number, receivers_list: any[], senders_list: any[], Zp: number): object;
/**
 * Compute the shares of the secret (as many shares as parties) using
 * a polynomial of degree: ceil(parties/2) - 1 (honest majority).
 * @param {number} secret - the secret to share.
 * @param {number} party_count - the number of parties in the entire computation (excluding servers).
 * @param {array} parties_list - array of party ids to share with.
 * @param {number} threshold - the minimimum number of parties needed to reconstruct the secret, defaults to all the recievers [optional].
 * @param {number} Zp - the modulos.
 * @returns {object} a map between party number (from 1 to parties) and its
 *          share, this means that (party number, share) is a
 *          point from the polynomial.
 *
 */
export function jiff_compute_shares(secret: number, party_count: number, parties_list: any[], threshold: number, Zp: number): object;
export function receive_share(jiff: any, sender_id: any, share: any, op_id: any): void;
export function jiff_open(jiff: any, share: any, parties: any): any;
/**
 * Opens a bunch of secret shares.
 * @param {jiff-instance} jiff - the jiff instance.
 * @param {array<share-object>} shares - an array containing this party's shares of the secrets to reconstruct.
 * @param {array} parties - an array with party ids (1 to n) of receiving parties [optional].
 *                          This must be one of 3 cases:
 *                          1. null:                       open all shares to all parties.
 *                          2. array of numbers:           open all shares to all the parties specified in the array.
 *                          3. array of array of numbers:  open share with index i to the parties specified
 *                                                         in the nested array at parties[i]. if parties[i] was null,
 *                                                         then shares[i] will be opened to all parties.
 * @returns {promise} a (JQuery) promise to ALL the open values of the secret, the promise will yield
 *                    an array of values, each corresponding to the given share in the shares parameter
 *                    at the same index.
 * @throws error if some shares does not belong to the passed jiff instance.
 */
export function jiff_open_all(jiff: any, shares: any, parties: any[]): Promise<any>;
export function jiff_broadcast(jiff: any, share: any, parties: any, op_ids: any): void;
export function receive_open(jiff: any, sender_id: any, share: any, op_id: any, Zp: any): void;
export function jiff_lagrange(shares: any, party_count: any, jiff: any): number;
/**
 * Can be used to generate shares of a random number, or shares of zero.
 * For a random number, every party generates a local random number and secret share it,
 * then every party sums its share, resulting in a single share of an unknown random number for every party.
 * The same approach is followed for zero, but instead, all the parties know that the total number is zero, but they
 * do not know the value of any resulting share (except their own).
 * @param {jiff-instance} jiff - the jiff instance.
 * @param {number} n - the number to share.
 * @param {number} threshold - the minimimum number of parties needed to reconstruct the secret, defaults to all the recievers [optional].
 * @param {array} receivers_list - array of party ids to share with, by default, this includes all parties [optional].
 * @param {array} senders_list - array of party ids to receive from, by default, this includes all parties [optional].
 * @param {number} Zp - the modulos (if null then global Zp is used by default) [optional].
 * @return {share-object} this party's share of the the number, null if this party is not a receiver.
 */
export function jiff_share_all_number(jiff: any, n: number, threshold: number, receivers_list: any[], senders_list: any[], Zp: number): any;
/**
 * Coerce a number into a share. THIS DOES NOT SHARE THE GIVEN NUMBER.
 * It is a local type-coersion by invoking the constructor on the given parameter,
 *  this is useful for for operating on constants, not sharing secret data.
 * If all parties use this function with the same input number, then
 *  you can think of their shares as being a share of that constant with threshold 1.
 *  In other words, a trivial sharing scheme where the share is the number itself.
 *  However, if some parties used different input numbers, then the actual value
 *  yielded by reconstruction/opening of all these shares is arbitrary and depends
 *  on all the input numbers of all parties.
 *  @param {jiff-instance} jiff - the jiff instance.
 *  @param {number} number - the number to coerce.
 *  @param {array} holders - array of party ids that will hold the shares, by default, this includes all parties [optional].
 *  @param {number} Zp - the modulos [optional].
 *  @returns {share-object} a share object containing the given number.
 *
 */
export function jiff_coerce_to_share(jiff: any, number: number, holders: any[], Zp: number): any;
/**
 * Create a new share.
 * A share is a value wrapper with a share object, it has a unique id
 * (per computation instance), and a pointer to the instance it belongs to.
 * A share also has methods for performing operations.
 * @memberof jiff
 * //@class
 * @param {jiff-instance} jiff - the jiff instance.
 * @param {boolean} ready - whether the value of the share is ready or deferred.
 * @param {promise} promise - a promise to the value of the share.
 * @param {number} value - the value of the share (null if not ready).
 * @param {array} holders - the parties that hold all the corresponding shares (must be sorted).
 * @param {number} threshold - the minimimum number of parties needed to reconstruct the secret.
 * @param {number} Zp - the modulos under which this share was created.
 * @returns {secret-share} the secret share object containing the give value.
 *
 */
export function secret_share(jiff: any, ready: boolean, promise: Promise<any>, value: number, holders: any[], threshold: number, Zp: number): any;
export function jiff_triplet(jiff: any, receivers_list: any, threshold: any, Zp: any): any[];
export function receive_triplet(jiff: any, triplet_id: any, triplet: any): void;
/**
 * Use the server to generate shares for a random bit, zero, random non-zero number, or a random number.
 * The parties will not know the value of the number (unless the request is for shares of zero) nor other parties' shares.
 * @param {jiff-instance} jiff - the jiff instance.
 * @param {object} options - an object with these properties:
 *                           { "number": number, "bit": boolean, "nonzero": boolean, "max": number}
 * @param {array} receivers_list - array of party ids that want to receive the triplet shares, by default, this includes all parties [optional].
 * @param {number} threshold - the minimimum number of parties needed to reconstruct the number.
 * @param {number} Zp - the modulos (if null then global Zp is used by default) [optional].
 */
export function jiff_server_share_number(jiff: any, options: object, receivers_list: any[], threshold: number, Zp: number): any;
export function receive_server_share_number(jiff: any, number_id: any, share: any): void;
