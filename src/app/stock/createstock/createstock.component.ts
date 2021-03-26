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
  itemcode: string;
  storeproduct: storeproduct[];

  productAdded: boolean;
  enableproduct: boolean;
  enablequantity: boolean;
  selectedIndex: number;
}

export interface storeproduct {
  instockqty: number;
  warehouse: warehouse;
  numbers: number[];
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

  changeProduct(storeProductIndex: any, productIndex: any) {
    debugger;
    let product = this.products[productIndex];
    if (product != null && product != undefined) {
      this.products[productIndex].enablequantity = false;
      this.products[productIndex].selectedIndex = +storeProductIndex;
    }
  }

  changeQuantity(quantity: number) {
    console.log(quantity);
  }

  addProduct(productIndex: any) {
    if (this.products[productIndex].productAdded) {
      this.products[productIndex].enableproduct = true;
      this.products[productIndex].enablequantity = true;
    } else {
      this.products[productIndex].enableproduct = false;
      this.products[productIndex].enablequantity = false;
    }
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
              i.selectedIndex = 0;
              i.productAdded = false;
              i.enablequantity = true;
              i.enableproduct = false;
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
