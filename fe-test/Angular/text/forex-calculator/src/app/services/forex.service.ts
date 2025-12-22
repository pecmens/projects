import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, of } from 'rxjs';
import { switchMap, shareReplay, catchError } from 'rxjs/operators';
export interface ForexRate {
  currency: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface ForexResponse {
  success: boolean;
  rates: { [key: string]: number };
  base?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForexService {
  private readonly API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';
  private readonly ALTERNATIVE_API = 'https://open.er-api.com/v6/latest/USD';
  
  private ratesSubject = new BehaviorSubject<ForexRate[]>([]);
  public rates$ = this.ratesSubject.asObservable();
  
  private lastUpdateSubject = new BehaviorSubject<Date>(new Date());
  public lastUpdate$ = this.lastUpdateSubject.asObservable();

  private previousRates: { [key: string]: number } = {};

  constructor(private http: HttpClient) {
    this.startRealTimeUpdates();
  }

  getForexRates(): Observable<ForexRate[]> {
    return timer(0, 30000).pipe(
      switchMap(() => this.fetchRates()),
      shareReplay(1),
      catchError(error => {
        console.error('获取外汇汇率失败:', error);
        return this.getFallbackRates();
      })
    );
  }

  private fetchRates(): Observable<ForexRate[]> {
    return this.http.get<ForexResponse>(this.API_URL).pipe(
      switchMap(response => {
        if (response.success) {
          return this.processRates(response.rates);
        } else {
          return this.fetchAlternativeRates();
        }
      }),
      catchError(() => this.fetchAlternativeRates())
    );
  }

  private fetchAlternativeRates(): Observable<ForexRate[]> {
    return this.http.get<ForexResponse>(this.ALTERNATIVE_API).pipe(
      switchMap(response => {
        if (response.rates) {
          return this.processRates(response.rates);
        }
        throw new Error('无法获取汇率数据');
      }),
      catchError(() => this.getFallbackRates())
    );
  }

  private processRates(rates: { [key: string]: number }): Observable<ForexRate[]> {
    const forexRates: ForexRate[] = [];
    const commonCurrencies = ['CNY', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD', 'KRW'];

    commonCurrencies.forEach(currency => {
      if (rates[currency]) {
        const currentRate = rates[currency];
        const previousRate = this.previousRates[currency] || currentRate;
        const change = currentRate - previousRate;
        const changePercent = previousRate !== 0 ? (change / previousRate) * 100 : 0;

        forexRates.push({
          currency,
          rate: currentRate,
          change,
          changePercent,
          timestamp: new Date()
        });

        this.previousRates[currency] = currentRate;
      }
    });

    this.ratesSubject.next(forexRates);
    this.lastUpdateSubject.next(new Date());

    return new Observable(observer => {
      observer.next(forexRates);
      observer.complete();
    });
  }

  private getFallbackRates(): Observable<ForexRate[]> {
    const fallbackRates: ForexRate[] = [
      { currency: 'CNY', rate: 7.25, change: 0.01, changePercent: 0.14, timestamp: new Date() },
      { currency: 'EUR', rate: 0.92, change: -0.002, changePercent: -0.22, timestamp: new Date() },
      { currency: 'GBP', rate: 0.79, change: 0.003, changePercent: 0.38, timestamp: new Date() },
      { currency: 'JPY', rate: 149.50, change: 0.50, changePercent: 0.34, timestamp: new Date() },
      { currency: 'AUD', rate: 1.52, change: -0.01, changePercent: -0.65, timestamp: new Date() },
      { currency: 'CAD', rate: 1.36, change: 0.002, changePercent: 0.15, timestamp: new Date() },
      { currency: 'CHF', rate: 0.88, change: -0.001, changePercent: -0.11, timestamp: new Date() },
      { currency: 'HKD', rate: 7.80, change: 0.01, changePercent: 0.13, timestamp: new Date() },
      { currency: 'SGD', rate: 1.35, change: 0.002, changePercent: 0.15, timestamp: new Date() },
      { currency: 'KRW', rate: 1290.00, change: 5.00, changePercent: 0.39, timestamp: new Date() }
    ];

    this.ratesSubject.next(fallbackRates);
    this.lastUpdateSubject.next(new Date());

    return new Observable(observer => {
      observer.next(fallbackRates);
      observer.complete();
    });
  }

  convertCurrency(fromCurrency: string, toCurrency: string, amount: number): Observable<number> {
    return this.rates$.pipe(
      switchMap(rates => {
        // 处理美元作为源货币的情况
        if (fromCurrency === 'USD') {
          const toRate = rates.find(r => r.currency === toCurrency);
          if (!toRate) {
            throw new Error(`无法找到 ${toCurrency} 的汇率`);
          }
          return of(amount * toRate.rate);
        }
        
        // 处理美元作为目标货币的情况
        if (toCurrency === 'USD') {
          const fromRate = rates.find(r => r.currency === fromCurrency);
          if (!fromRate) {
            throw new Error(`无法找到 ${fromCurrency} 的汇率`);
          }
          return of(amount / fromRate.rate);
        }
        
        // 处理两种非美元货币之间的转换
        const fromRate = rates.find(r => r.currency === fromCurrency);
        const toRate = rates.find(r => r.currency === toCurrency);

        if (!fromRate || !toRate) {
          throw new Error(`无法找到 ${fromCurrency} 或 ${toCurrency} 的汇率`);
        }

        const usdAmount = amount / fromRate.rate;
        const convertedAmount = usdAmount * toRate.rate;

        return of(convertedAmount);
      })
    );
  }

  private startRealTimeUpdates(): void {
    this.getForexRates().subscribe();
  }
}
