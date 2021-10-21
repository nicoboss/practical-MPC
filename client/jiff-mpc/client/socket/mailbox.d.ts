export = guardedSocket;
/**
 * A guarded socket with an attached mailbox.
 *
 * The socket uses the mailbox to store all outgoing messages, and removes them from the mailbox only when
 * the server acknowledges their receipt. The socket resends mailbox upon re-connection. Extends {@link https://socket.io/docs/client-api/#Socket}.
 * @see {@link module:jiff-client~JIFFClient#socket}
 * @name GuardedSocket
 * @alias GuardedSocket
 * @constructor
 */
declare function guardedSocket(jiffClient: any): any;
declare class guardedSocket {
    /**
     * A guarded socket with an attached mailbox.
     *
     * The socket uses the mailbox to store all outgoing messages, and removes them from the mailbox only when
     * the server acknowledges their receipt. The socket resends mailbox upon re-connection. Extends {@link https://socket.io/docs/client-api/#Socket}.
     * @see {@link module:jiff-client~JIFFClient#socket}
     * @name GuardedSocket
     * @alias GuardedSocket
     * @constructor
     */
    constructor(jiffClient: any);
}
