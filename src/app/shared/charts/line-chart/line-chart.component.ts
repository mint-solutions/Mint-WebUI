import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() lineLabels: Label[];
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'USD' },
    { data: [28, 48, 40, 99, 86, 27, 90], label: 'GDB' },
    {
      data: [80, 40, 70, 90, 50, 27, 40],
      label: 'NGN'
    }
  ];
  //public lineChartLabels: Label[] = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ];

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
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          position: 'left',
          gridLines: {
            display: false
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
  public lineChartColors: any[] = [
    {
      // grey
      backgroundColor: 'rgba(201, 138, 235, .5)',
      borderColor: 'rgba(201, 138, 235, .5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      gradient: true,
      borderWidth: 1
    },
    {
      // dark grey
      backgroundColor: 'rgba(124,144,255,0.5)',
      borderColor: 'rgba(124,144,255, .5)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
      gradient: true
    },
    {
      // red
      backgroundColor: 'rgba(132,136,250,0.5)',
      borderColor: 'rgba(132,136,250,0.5)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      borderWidth: 1
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor() {}

  ngOnInit() {}
}
