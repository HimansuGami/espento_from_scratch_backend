export enum MEMBER_TYPE {
  direct = 'direct',
  other = 'other',
}

export class IMembers {
  parentAddress: string;
  ehash: string;
  fromAddress: string;
  childNumber: number;
  atLevel: number;
  //type: MEMBER_TYPE;
}
