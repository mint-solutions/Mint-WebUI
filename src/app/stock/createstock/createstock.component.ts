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
import { isNullOrUndefined } from 'util';

export interface SelectedProductElement {
  id: string;
  name: string;
  position: number;
  itemCode: string;
  storeproduct: storeproduct[];

  enablequantity: boolean;
  selectedIndex: number;
}

export interface storeproduct {
  instockqty: number;
  warehouse: warehouse;
  numbers: number[];
  selectedIndex: number;
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
  id: string;

  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  public title = 'Create New Stock Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Stock Order',
      cssClass: 'active'
    }
  ];
  loader: boolean;
  warehouseqty: number;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    public modal: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    //this.productDataSource.paginator = this.paginator;
    this.getProducts();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  changeProduct(index: any, itemcode: any) {
    debugger;
    let product = this.products.find(x => (x.itemCode = itemcode));
    if (!isNullOrUndefined(product)) {
      product.enablequantity = false;
      product.selectedIndex = index;
    }
  }

  changeQuantity(quantity: number) {
    console.log(quantity);
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

            for (let i of this.products) {
              i.enablequantity = true;
              i.selectedIndex = 0;
              for (let j of i.storeproduct) {
                j.numbers = [];
                Array(j.instockqty)
                  .fill(0)
                  .map((x, i) => {
                    j.numbers.push(i + 1);
                  });
              }
            }

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
