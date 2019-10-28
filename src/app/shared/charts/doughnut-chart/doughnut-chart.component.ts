import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, SingleDataSet, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {
  @Input() doughnutLabels: Label[];

  doughnutChartLabels: Label[] = ['Processing', 'Pending', 'Successful', 'Failed'];
  doughnutChartData: MultiDataSet = [[55, 25, 20, 3]];
  doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: any = {
    responsive: true,
    legend: {
      display: false
    }
  };

  public donutColors = [
    {
      backgroundColor: [
        'rgba(41, 146, 208, .8)',
        'rgba(206, 183, 44, .8)',
        'rgba(76, 183, 74, .8)',
        'rgba(226, 71, 71, .8)'
      ],
      borderWidth: 1,
      borderColor: [
        'rgba(41, 146, 208, .8)',
        'rgba(206, 183, 44, .8)',
        'rgba(76, 183, 74, .8)',
        'rgba(226, 71, 71, .8)'
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}
}
