export interface IPerformance {
  playID: string;
  audience: number;
}

export interface IInvoice {
  customer: string;
  performances: IPerformance[];
}

export interface IPlay<T> {
  name: string;
  type: T;
}
export interface IPlays<T> {
  [key: string]: IPlay<T>;
}
