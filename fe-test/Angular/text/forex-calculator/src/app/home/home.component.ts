import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForexService, ForexRate } from '../services/forex.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  forexRates: ForexRate[] = [];
  lastUpdate: Date = new Date();
  isLoading = false;
  
  // 货币转换相关
  fromCurrency = 'USD';
  toCurrency = 'CNY';
  amount = 100;
  convertedAmount = 0;
  
  private ratesSubscription: Subscription | null = null;
  private updateSubscription: Subscription | null = null;

  constructor(private forexService: ForexService) {}

  ngOnInit(): void {
    this.isLoading = true;
    
    // 订阅汇率数据
    this.ratesSubscription = this.forexService.rates$.subscribe(
      rates => {
        this.forexRates = rates;
        this.isLoading = false;
        this.performConversion();
      },
      error => {
        console.error('汇率数据订阅失败:', error);
        this.isLoading = false;
      }
    );

    // 订阅更新时间
    this.updateSubscription = this.forexService.lastUpdate$.subscribe(
      timestamp => {
        this.lastUpdate = timestamp;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.ratesSubscription) {
      this.ratesSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  performConversion(): void {
    if (this.amount <= 0 || this.fromCurrency === this.toCurrency) {
      this.convertedAmount = this.amount;
      return;
    }

    // 检查汇率数据是否已加载
    if (this.forexRates.length === 0) {
      return;
    }

    this.forexService.convertCurrency(this.fromCurrency, this.toCurrency, this.amount)
      .subscribe({
        next: (result) => {
          this.convertedAmount = result;
        },
        error: (error) => {
          console.error('货币转换失败:', error);
          this.convertedAmount = 0;
        }
      });
  }

  onAmountChange(): void {
    this.performConversion();
  }

  onCurrencyChange(): void {
    this.performConversion();
  }

  swapCurrencies(): void {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.performConversion();
  }

  getChangeClass(changePercent: number): string {
    if (changePercent > 0) return 'positive';
    if (changePercent < 0) return 'negative';
    return 'neutral';
  }

  getChangeIcon(changePercent: number): string {
    if (changePercent > 0) return '▲';
    if (changePercent < 0) return '▼';
    return '●';
  }

  refreshRates(): void {
    this.isLoading = true;
    this.forexService.getForexRates().subscribe();
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num);
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  getAbsoluteValue(num: number): number {
    return Math.abs(num);
  }

  getCurrencyName(currencyCode: string): string {
    const currencyNames: { [key: string]: string } = {
      'USD': '美元',
      'CNY': '人民币',
      'EUR': '欧元',
      'GBP': '英镑',
      'JPY': '日元',
      'AUD': '澳元',
      'CAD': '加元',
      'CHF': '瑞士法郎',
      'HKD': '港币',
      'SGD': '新加坡元',
      'KRW': '韩元'
    };
    return currencyNames[currencyCode] || currencyCode;
  }
}
