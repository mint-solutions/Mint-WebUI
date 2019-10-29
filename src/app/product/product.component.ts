import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';

const log = new Logger('home');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading = false;

  public sidebarVisible = true;
  public title = 'Product';
  public breadcrumbItem: any = [
    {
      title: 'Product',
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
