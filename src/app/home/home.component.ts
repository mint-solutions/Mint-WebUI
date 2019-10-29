import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
declare var require: any;

import { QuoteService } from './quote.service';
import EChartOption = echarts.EChartOption;
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

const log = new Logger('home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading = false;

  public sidebarVisible = true;
  public title = 'Dashboard';
  public breadcrumbItem: any = [
    {
      title: 'Dashboard',
      cssClass: 'active'
    }
  ];
  public earningOptions: EChartOption = {};
  public salesOptions: EChartOption = {};
  public visitsAreaOptions: EChartOption = {};
  public LikesOptions: EChartOption = {};
  public stackedBarChart: EChartOption = {};
  public dataManagedBarChart: EChartOption = {};

  public earningOptionsSeries: Array<number> = [1, 4, 1, 3, 7, 1];
  public earnings: string = '₦' + (this.earningOptionsSeries.reduce((a, b) => a + b, 0) * 1000).toLocaleString();
  public salesOptionsSeries: Array<number> = [1, 4, 2, 3, 6, 2];
  public sales: string = '₦' + (this.salesOptionsSeries.reduce((a, b) => a + b, 0) * 10000).toLocaleString();
  public visitsAreaOptionsSeries: Array<number> = [1, 4, 2, 3, 1, 5];
  public visits: number = this.visitsAreaOptionsSeries.reduce((a, b) => a + b, 0);
  public LikesOptionsSeries: Array<number> = [1, 3, 5, 1, 4, 2];
  public likes: number = this.LikesOptionsSeries.reduce((a, b) => a + b, 0);

  public interval: any = {};

  constructor(private quoteService: QuoteService, private cdr: ChangeDetectorRef, private toastr: ToastrService) {
    this.earningOptions = this.loadLineAreaChartOptions([1, 4, 1, 3, 7, 1], '#f79647', '#fac091');
    this.salesOptions = this.loadLineAreaChartOptions([1, 4, 2, 3, 6, 2], '#604a7b', '#a092b0');
    this.visitsAreaOptions = this.loadLineAreaChartOptions([1, 4, 2, 3, 1, 5], '#4aacc5', '#92cddc');
    this.LikesOptions = this.loadLineAreaChartOptions([1, 3, 5, 1, 4, 2], '#4f81bc', '#95b3d7');
    this.dataManagedBarChart = this.getDataManagedChartOptions();
  }

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'USD' },
    { data: [28, 48, 40, 99, 86, 27, 90], label: 'GDB' },
    {
      data: [80, 40, 70, 90, 50, 27, 40],
      label: 'NGN'
    }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: '#555'
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          position: 'left',
          gridLines: {
            color: 'rgba(255,255,255,0)'
          },
          ticks: {
            fontColor: '#555'
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(201, 138, 235, .5)',
      borderColor: 'rgba(201, 138, 235, .5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(124,144,255,0.5)',
      borderColor: 'rgba(124,144,255, .5)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      // red
      backgroundColor: 'rgba(132,136,250,0.5)',
      borderColor: 'rgba(132,136,250,0.5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  ngOnInit() {
    this.isLoading = true;
    this.chartIntervals();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  showToastr() {
    this.toastr.info('Hello, welcome to Yego.', undefined, {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }

  chartIntervals() {
    const that = this;
    this.interval = setInterval(function() {
      that.earningOptionsSeries.shift();
      let rand = Math.floor(Math.random() * 11);
      if (!rand) {
        rand = 1;
      }
      that.earningOptionsSeries.push(rand);
      that.earningOptions = that.loadLineAreaChartOptions(that.earningOptionsSeries, '#f79647', '#fac091');
      that.earnings = '₦' + (that.earningOptionsSeries.reduce((a, b) => a + b, 0) * 1000).toLocaleString();

      that.salesOptionsSeries.shift();
      rand = Math.floor(Math.random() * 11);
      if (!rand) {
        rand = 1;
      }
      that.salesOptionsSeries.push(rand);
      that.salesOptions = that.loadLineAreaChartOptions(that.salesOptionsSeries, '#604a7b', '#a092b0');
      that.sales = '₦' + (that.salesOptionsSeries.reduce((a, b) => a + b, 0) * 10000).toLocaleString();

      that.visitsAreaOptionsSeries.shift();
      rand = Math.floor(Math.random() * 11);
      if (!rand) {
        rand = 1;
      }
      that.visitsAreaOptionsSeries.push(rand);
      that.visits += rand;
      that.visitsAreaOptions = that.loadLineAreaChartOptions(that.visitsAreaOptionsSeries, '#4aacc5', '#92cddc');

      that.LikesOptionsSeries.shift();
      rand = Math.floor(Math.random() * 11);
      if (!rand) {
        rand = 1;
      }
      that.LikesOptionsSeries.push(rand);
      that.likes += rand;
      that.LikesOptions = that.loadLineAreaChartOptions(that.LikesOptionsSeries, '#4f81bc', '#95b3d7');
      that.cdr.markForCheck();
    }, 3000);
  }

  loadLineAreaChartOptions(data: any, color: any, areaColor: any) {
    let chartOption: EChartOption;
    const xAxisData: Array<any> = new Array<any>();

    data.forEach((element: any) => {
      xAxisData.push('');
    });

    return (chartOption = {
      xAxis: {
        type: 'category',
        show: false,
        data: xAxisData,
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 1
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any, ticket: any, callback: any) {
          return (
            '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' +
            color +
            ';"></span>' +
            params[0].value
          );
        }
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '0%',
        containLabel: false
      },
      series: [
        {
          data: data,
          type: 'line',
          showSymbol: false,
          symbolSize: 1,
          lineStyle: {
            color: color,
            width: 1
          },
          areaStyle: {
            color: areaColor
          }
        }
      ]
    });
  }

  getDataManagedChartOptions() {
    const options: EChartOption = {
      tooltip: {
        trigger: 'item'
      },
      grid: {
        borderWidth: 0,
        y: 80,
        y2: 60
      },
      xAxis: [
        {
          type: 'category',
          show: false
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: false
        }
      ],
      series: [
        {
          type: 'bar',
          stack: 'Gedgets',
          data: [2, 0, 5, 0, 4, 0, 8, 0, 3, 0, 9, 0, 1, 0, 5],
          itemStyle: {
            color: '#7460ee'
          },
          barWidth: '5px'
        },
        {
          type: 'bar',
          stack: 'Gedgets',
          data: [0, -5, 0, -1, 0, -9, 0, -3, 0, -8, 0, -4, 0, -5, 0],
          itemStyle: {
            color: '#afc979'
          },
          barWidth: '5px'
        }
      ]
    };

    return options;
  }
}
