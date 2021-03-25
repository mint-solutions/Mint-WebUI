import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../product/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { componentError, serverError } from '@app/helper';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

export interface SelectedProductElement {
  id: string;
  name: string;
  position: number;
  itemCode: string;
  storeproduct: storeproduct[];
}

export interface storeproduct {
  instockqty: number;
}

export interface warehouse {
  id: string;
  name: string;
}

const SELECTED_PRODUCT_DATA: SelectedProductElement[] = [];

@Component({
  selector: 'app-createstock',
  templateUrl: './createstock.component.html',
  styleUrls: ['./createstock.component.scss']
})
export class CreatestockComponent implements OnInit, AfterViewInit, OnDestroy {
  //@ViewChild(MatPaginator)
  //paginator: MatPaginator;
  products: SelectedProductElement[] = [];
  productid: string;

  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  productDataSource = new MatTableDataSource<SelectedProductElement>(SELECTED_PRODUCT_DATA);
  displayedCustomerColumns: string[] = ['select', 'position', 'itemCode', 'name', 'instockqty'];
  public title = 'Create New Stock Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Stock Order',
      cssClass: 'active'
    }
  ];
  loader: boolean;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public modal: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productDataSource.paginator = this.paginator;
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getProducts() {
    this.loader = true;
    this.productService
      .getRequestProducts()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getProducts', res);
          if (res.status === true) {
            this.products = res.result;
            debugger;
            console.log(this.products);
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }
}
