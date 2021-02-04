import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { SalesOrderService } from '../sales-order.service';
import { CustomerService } from '../../customer/customer.service';
import { ProductService } from '../../product/product.service';
import { PaymentTermsService } from '../../settings/payment-terms/payment-terms.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

const log = new Logger('home');

export interface SelectedCustomerElement {
  fullname: string;
  position: number;
  mobilenumber: string;
  email: string;
  customerId: string;
}

export interface SelectedProductElement {
  name: string;
  position: number;
  itemCode: number;
  wholesaleCost: number;
  retailCost: number;
  productId: number;
  ctnQuantity: number;
  unitQuantity: number;
  pack: number;
}

const CUSTOMER_TABLE_DATA: SelectedCustomerElement[] = [];

const PRODUCT_TABLE_DATA: SelectedProductElement[] = [];
const SELECTED_PRODUCT_DATA: SelectedProductElement[] = [];
let TEMP_SELECTION: string;

@Component({
  selector: 'sales-order-modal',
  templateUrl: 'sales-order-modal.html',
  styleUrls: ['./sales-order-create.component.scss']
})
export class SalesOrderModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SalesOrderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectedProductElement
  ) {}

  onNoClick(data: SelectedProductElement): void {
    const tempSelection = JSON.parse(TEMP_SELECTION);
    Object.keys(data).forEach(key => {
      data[key] = tempSelection[key];
    });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.scss'],
  providers: [ProductService]
})
export class SalesOrderCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  cardTitle = 'New Sales Order';
  salesOrderFormOne: FormGroup;
  salesOrderFormTwo: FormGroup;
  salesOrderFormThree: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;
  displayedCustomerColumns: string[] = ['select', 'position', 'fullname', 'email', 'phonenumber'];
  displayedProductColumns: string[] = ['select', 'position', 'itemCode', 'name', 'pack'];
  displayedSelectedProductColumns: string[] = [
    'position',
    'name',
    'wholesaleCost',
    'retailCost',
    'pack',
    'ctnQuantity',
    'unitQuantity',
    'action'
  ];
  selection = new SelectionModel<SelectedCustomerElement>(true, []);
  productSelection = new SelectionModel<SelectedProductElement>(true, []);
  customerDataSource = new MatTableDataSource<SelectedCustomerElement>(CUSTOMER_TABLE_DATA);
  productDataSource = new MatTableDataSource<SelectedProductElement>(PRODUCT_TABLE_DATA);
  selectedProductSource = new MatTableDataSource<SelectedProductElement>(SELECTED_PRODUCT_DATA);
  customers: any[] = [];
  products: any[] = [];
  paymentTerms: any[] = [];
  saleTypes = [{ name: 'Wholesale', enum: 1 }, { name: 'Retail', enum: 2 }];

  mode = 'Create';

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];

  public sidebarVisible = true;
  public title = 'Create New Sales Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Sales Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: Router,
    private salesOrderService: SalesOrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private paymentTermsService: PaymentTermsService,
    public modal: MatDialog
  ) {
    if (this.route.getCurrentNavigation() != null) {
      this.selectedRow = this.route.getCurrentNavigation().extras.state;
      console.log('state', this.selectedRow);
    }
  }

  ngOnInit() {
    this.customerDataSource.paginator = this.paginator;
    this.productDataSource.paginator = this.paginator;
    this.selectedProductSource.paginator = this.paginator;
    this.createForm();
    this.getCustomers();
    this.getProducts();
    this.getPaymentTerms();
    if (this.selectedRow && this.selectedRow.mode === 'edit') {
      this.mode = 'Update';
      this.cardTitle = 'Edit Sales Order';
      this.salesOrderFormOne.patchValue({
        customerId: this.selectedRow.customerId
      });
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy() {}

  applyFilter(filterValue: string) {
    this.customerDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyProductFilter(filterValue: string) {
    this.productDataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.customerDataSource.data.length;
    return numSelected === numRows;
  }

  isAllProductSelected() {
    const numSelected = this.productSelection.selected.length;
    const numRows = this.productDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.customerDataSource.data.forEach(row => this.selection.select(row));
  }

  masterProductToggle() {
    this.isAllProductSelected()
      ? this.productSelection.clear()
      : this.productDataSource.data.forEach(row => this.productSelection.select(row));
    this.updateProductForm(this.productDataSource.data[0]);
  }

  mapSelectedProducts() {
    this.selectedProductSource.data = this.productSelection.selected.map(product => product);
  }

  openDialog(data: any): void {
    TEMP_SELECTION = JSON.stringify(data);
    const dialogRef = this.modal.open(SalesOrderModalComponent, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      // Do nothing
    });
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: SelectedCustomerElement): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }

  // productCheckboxLabel(row?: SelectedProductElement): string {
  //   if (!row) {
  //     return `${this.isAllProductSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.productSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }

  toggleCustomerSelection(row: SelectedCustomerElement) {
    this.selection.toggle(row);
    if (this.selection.hasValue()) {
      this.salesOrderFormOne.patchValue({
        customerId: row.customerId
      });
    } else {
      this.salesOrderFormOne.reset();
    }
  }

  toggleProductSelection(row: SelectedProductElement) {
    this.productSelection.toggle(row);
    this.updateProductForm(row);
  }

  updateProductForm(row: SelectedProductElement) {
    if (this.productSelection.hasValue()) {
      this.salesOrderFormTwo.patchValue({
        productId: row.productId
      });
    } else {
      this.salesOrderFormTwo.reset();
    }
  }

  getCustomers() {
    this.loader = true;
    this.customerService
      .getCustomers()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getCustomers', res);
          if (res.status === true) {
            this.customers = res.result;
            this.customerDataSource.data = this.customers.map((customer, index) => {
              const { fullname, mobilenumber, email, id: customerId } = customer;
              return { fullname, mobilenumber, email, customerId, position: index + 1 };
            });
            this.cdr.detectChanges();
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getPaymentTerms() {
    this.loader = true;
    this.paymentTermsService
      .getPaymentTerms()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getPaymentTerms', res);
          if (res.status === true) {
            this.paymentTerms = res.result;
            console.log(res);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getProducts() {
    this.loader = true;
    this.productService
      .getProducts()
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
            this.productDataSource.data = this.products.map((product, index) => {
              const position = index + 1;
              const {
                name,
                itemcode: itemCode,
                id: productId,
                productconfiguration: { pack }
              } = product;
              return {
                position,
                name,
                itemCode,
                retailCost: 0,
                wholesaleCost: 0,
                productId,
                pack,
                unitQuantity: 0,
                ctnQuantity: 0
              };
            });
            console.log('dataSource', this.productDataSource);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onSubmit() {
    this.formLoading = true;
    console.log('this.mode', this.mode);

    if (this.salesOrderFormOne.valid && this.salesOrderFormTwo.valid && this.salesOrderFormThree.valid) {
      const productId = this.salesOrderFormTwo.value.productId;
      const product = this.products.find(item => item.id === productId);
      const salesItems = [
        {
          ...product,
          productId
        }
      ];
      const data = {
        customerId: this.salesOrderFormOne.value.customerId,
        paymentTermId: this.salesOrderFormThree.value.paymenttermId,
        emailsaleOrder: this.salesOrderFormThree.value.emailsaleOrder,
        saleType: this.salesOrderFormThree.value.saleType,
        salesItems
      };

      console.log('pament terms data', data);
      switch (this.mode) {
        case 'Create':
          this.onCreate(data);
          break;
        case 'Update':
          this.onUpdate(data);
          break;
      }
    }
  }

  onCreate(data: any) {
    console.log(data, 'it is here');

    this.salesOrderService
      .createSalesOrder(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            if (res.result && res.result.length > 0) {
              res.result.forEach((err: any) => {
                this.toastr.error(err.Message, err.Identifier);
              });
            }
            console.log('error', res);
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Purchase Order');
          this.resetForm();
          this.route.navigate(['/', 'salesOrder', 'view']);
        },
        error => {
          serverError(error, this.toastr);
        }
      );
  }

  onUpdate(data: any) {
    console.log('onUpdate', data);
    const payload = {
      ...data,
      id: this.selectedRow.id
    };

    this.salesOrderService
      .updateSalesOrder(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Purchase Order');
          this.route.navigate(['/', 'salesOrder', 'view']);
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    this.salesOrderFormOne = this.formBuilder.group({
      customerId: ['', [Validators.required]]
    });
    this.salesOrderFormTwo = this.formBuilder.group({
      productId: ['', [Validators.required]]
    });
    this.salesOrderFormThree = this.formBuilder.group({
      paymenttermId: ['', [Validators.required]],
      emailsaleOrder: ['', []],
      deliveryDate: ['', [Validators.required]],
      additionalinfo: ['', [Validators.required]]
    });
  }

  resetForm() {
    this.salesOrderFormOne.reset();
    this.salesOrderFormTwo.reset();
    this.salesOrderFormThree.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
