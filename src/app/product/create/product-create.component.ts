import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';

const log = new Logger('home');

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading = false;

  public sidebarVisible = true;
  public title = 'Create New Product';
  public breadcrumbItem: any = [
    {
      title: 'Create New Product',
      cssClass: 'active'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService) {}

  ngOnInit() {}

  ngOnDestroy() {}

  showToastr() {
    this.toastr.info('Hello, welcome to Yego.', undefined, {
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }
}
