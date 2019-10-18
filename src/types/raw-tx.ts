import { ActionTrace } from './action-trace';

export interface RawTx {

  transaction_id: string;

  processed: {

    id: string;

    producer_block_id: string;

    block_num: number;

    block_time: string;

    elapsed: number;

    except: any;

    net_usage: number;

    scheduled: number;

    receipt: {

      cpu_usage_us: number;

      net_usage_words: number;

      status: string;
    };

    action_traces: ActionTrace[];
  };
}
