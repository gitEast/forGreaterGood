// import invoices from './invoices.json';
// import plays from './plays.json';
import type { IInvoice, IPerformance, IPlays, IPlay } from './types';
import { PlayType, invoices, plays } from './data';

function statement(invoice: IInvoice, plays: IPlays<PlayType>) {
  let result = `Statement for ${invoice.customer}\n`;
  for (const perf of invoice.performances) {
    // print line for this order
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    } seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function totalAmount() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  function totalVolumeCredits() {
    let result = 0;
    for (const perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function usd(aNumber: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber / 100);
  }

  function volumeCreditsFor(aPerformance: IPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === PlayType.comedy) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function playFor(aPerformance: IPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: IPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case PlayType.tragedy:
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case PlayType.comedy:
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknow type: ${playFor(aPerformance).type}`);
    }

    return result;
  }
}

console.log(statement(invoices[0], plays));
