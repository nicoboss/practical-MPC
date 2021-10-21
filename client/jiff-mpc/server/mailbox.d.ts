export namespace hooks {
    function putInMailbox(jiff: any, label: any, msg: any, computation_id: any, to_id: any): any;
    function getFromMailbox(jiff: any, computation_id: any, party_id: any): {
        id: any;
        label: any;
        msg: any;
    }[];
    function removeFromMailbox(jiff: any, computation_id: any, party_id: any, mailbox_pointer: any): void;
    function sliceMailbox(jiff: any, computation_id: any, party_id: any, mailbox_pointer: any): void;
}
export function initPrototype(JIFFServer: any): void;
