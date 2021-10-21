export function make_jiff(http: any, options: any): {
    logs: boolean;
    io: any;
    socket_map: {};
    party_map: {};
    computation_map: {};
    client_map: {};
    totalparty_map: {};
    key_map: {};
    secret_key_map: {};
    triplets_map: {};
    numbers_map: {};
    computation_instances_map: {};
    start_computation_deferred: {};
    computation_deferreds: {};
    computation_shares: {};
    compute(computation_id: any, computation_callback: any): void;
    request_triplet_share(msg: any, computation_id: any, from_id: any): {
        triplet: any;
        triplet_id: any;
    };
    request_number_share(msg: any, computation_id: any, from_id: any): {
        number: any;
        number_id: any;
    };
};
export function create_computation_instance(jiff: any, computation_id: any): {
    server: any;
    computation_id: any;
    ready: boolean;
    id: string;
    secret_key: any;
    public_key: any;
    keymap: any;
    party_count: any;
    server_count: number;
    share_op_count: {};
    open_op_count: {};
    triplet_op_count: {};
    number_op_count: {};
    share_obj_count: number;
    deferreds: any;
    shares: any;
    share(secret: any, threshold: any, receivers_list: any, senders_list: any, Zp: any): any;
    open(share: any, parties: any): any;
    open_all(shares: any, parties: any): any;
    generate_and_share_random(threshold: any, receivers_list: any, senders_list: any, Zp: any): any;
    generate_and_share_zero(threshold: any, receivers_list: any, senders_list: any, Zp: any): any;
    coerce_to_share(number: any, holders: any, Zp: any): any;
    triplet(receivers_list: any, threshold: any, Zp: any): any;
    server_generate_and_share(options: any, receivers_list: any, threshold: any, Zp: any): any;
    socket: {
        emit: (label: any, msg: any) => void;
    };
    triplets_socket: {
        emit: (label: any, msg: any) => void;
    };
    numbers_socket: {
        emit: (label: any, msg: any) => void;
    };
};
