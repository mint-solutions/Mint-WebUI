import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';

const log = new Logger('home');

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading = false;

  public sidebarVisible = true;
  public title = 'Category';
  public breadcrumbItem: any = [
    {
      title: 'Category',
      cssClass: 'active'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSubmit() {
    this.toastr.info('Hello, welcome to eCorvids.', undefined, {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }
}
