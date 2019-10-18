import { ActionTrace } from './action-trace';

export interface ActionItem {

  account_action_seq: number;

  action_trace: ActionTrace;

  block_num: number;

  block_time: string;

  global_action_seq: number;
}
