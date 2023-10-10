import type { IInvoice, IPlays } from './types';

export enum PlayType {
  tragedy,
  comedy
}

export const plays: IPlays<PlayType> = {
  hamlet: {
    name: 'Hamlet',
    type: PlayType.tragedy
  },
  'as-like': {
    name: 'As You Like It',
    type: PlayType.comedy
  },
  othello: {
    name: 'Othello',
    type: PlayType.tragedy
  }
};

export const invoices: IInvoice[] = [
  {
    customer: 'BigCo',
    performances: [
      {
        playID: 'hamlet',
        audience: 55
      },
      {
        playID: 'as-like',
        audience: 35
      },
      {
        playID: 'othello',
        audience: 40
      }
    ]
  }
];
