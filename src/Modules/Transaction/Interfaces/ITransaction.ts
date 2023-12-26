export class Itransaction {
  timeStamp: number;
  ehash?: string;
  transactionHash: string;
  from: string;
  to: string;
  data: string;
  blockNumber: number;
  events: IEvent[];
}
export class IEvent {
  signature: string;
  topicId: string;
  name: string;
  args: string;
}
