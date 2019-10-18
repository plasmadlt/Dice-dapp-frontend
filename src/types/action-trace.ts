import { ActionAuthorization } from './action-authorization';

export interface ActionTrace {

  trx_id: string;

  producer_block_id: string;

  block_num: number;

  block_time: string;

  context_free: boolean;

  elapsed: number;

  except: any;

  console: string;

  receipt: {

    abi_sequence: number;

    act_digest: string;

    auth_sequence: [string, number][];

    code_sequence: number;

    global_sequence: number;

    receiver: string;

    recv_sequence: number;
  };

  act: {

    account: string;

    hex_data: string;

    name: string;

    authorization: ActionAuthorization[];

    data: any;
  };

  inline_traces: ActionTrace[];

  account_ram_deltas: {

    account: string;

    delta: number;
  }[];
}
