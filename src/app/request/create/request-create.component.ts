import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../request.service';
import { SupplierService } from '@app/supplier/supplier.service';
import { BusinessLocationService } from '@app/settings/business-location/business-location.service';
import { WarehouseService } from '@app/settings/warehouse/warehouse.service';
import { ProductService } from '../../product/product.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

const log = new Logger('home');

export interface SelectedElement {
  position: number;
  name: string;
  productId: string;
  storeproduct: any;
}

const PRODUCT_TABLE_DATA: SelectedElement[] = [];
const SELECTED_TABLE_DATA: SelectedElement[] = [];

let TEMP_SELECTION: string;

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.scss'],
  providers: [ProductService]
})
export class RequestCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  products: any[] = [];
  dataSource = new MatTableDataSource<SelectedElement>(PRODUCT_TABLE_DATA);
  selectedSource = new MatTableDataSource<SelectedElement>(SELECTED_TABLE_DATA);
  displayedColumns: string[] = ['select', 'position', 'name'];
  displayedSelectedColumns: string[] = ['position', 'name', 'action'];
  selection = new SelectionModel<SelectedElement>(true, []);
  sharedServiceSubsscription: Subscription;

  cardTitle = 'Create Request';
  purchaseOrderFormOne: FormGroup;
  purchaseOrderFormTwo: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;
  mode: string = 'Create';
  purchaseOrder: any[] = [];

  subscription: Subscription;

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];
  businessLocations: any[] = [];
  warehouses: any[] = [];

  public sidebarVisible = true;
  public title = 'Create Request';
  public breadcrumbItem: any = [
    {
      title: 'Create Request',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private requestService: RequestService,
    private businessLocationService: BusinessLocationService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    public modal: MatDialog,
    private routes: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.loader = true;
    this.dataSource.paginator = this.paginator;
    this.selectedSource.paginator = this.paginator;
    this.createForm();
    this.getProducts();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: SelectedElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  useSelectedProducts() {
    this.selectedSource.data = this.selection.selected.map(product => product);
  }

  getSuppliers() {
    this.suppliersLoader = true;
    this.supplierService
      .getsuppliers()
      .pipe(
        finalize(() => {
          this.suppliersLoader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getSuppliers', res);
          if (res.status === true) {
            this.suppliers = res.result;
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
      .getRequestProducts()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getProductsForPurchase', res);
          if (res.status === true) {
            this.products = res.result;
            this.dataSource.data = this.products.map((product, index) => {
              const position = index + 1;
              const { name, itemcode: itemCode, id: productId, storeproduct } = product;
              return {
                position,
                name,
                productId,
                storeproduct
              };
            });
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

    if (this.purchaseOrderFormTwo.valid && this.purchaseOrderFormTwo.valid) {
      const purchaseItems = this.selection.selected.map(selected => {
        const { productId: productid } = selected;
        return {
          productid
        };
      });

      if (!purchaseItems.length) {
        return this.toastr.error('Customize your orders and try again', 'Invalid GRN');
      }

      const data = {
        comment: this.purchaseOrderFormTwo.value.comment,
        purchaseItems
      };

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
    this.requestService
      .createPurchaseOrder(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          console.log('createPurchaseOrder', res);
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
          this.router.navigate(['/', 'grn', 'view']);
        },
        error => {
          serverError(error, this.toastr);
        }
      );
  }

  onUpdate(data: any) {
    const payload = {
      ...data,
      purchaseorderid: this.purchaseOrder[0]['id']
    };

    console.log(payload);

    this.requestService
      .updateGrn(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Purchase Order');
          this.router.navigateByUrl('/grn/view');
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.purchaseOrderFormOne = this.formBuilder.group({
      productId: ['', [Validators.required]]
    });
    this.purchaseOrderFormTwo = this.formBuilder.group({
      supplierId: ['', [Validators.required]],
      shiptobusinessId: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      warehouseId: ['', [Validators.required]],
      invoiceNumber: ['', [Validators.required]],
      comment: ['', [Validators.required]]
    });
  }

  resetForm() {
    this.purchaseOrderFormOne.reset();
    this.purchaseOrderFormTwo.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }

  setUnitQuantity() {
    const ctnQuantity = this.purchaseOrderFormTwo.value.ctnquantity;
    const product = this.getProductById();
    const {
      productconfiguration: { pack }
    } = product;
    const unitQuantity = pack * ctnQuantity;
    this.purchaseOrderFormTwo.patchValue({ unitquantity: unitQuantity });
  }

  getProductById() {
    const productId = this.purchaseOrderFormOne.value.productId;
    return this.products.find(x => x.id === productId);
  }

  destructureProduct() {
    const product = this.getProductById();

    const { priceconfiguration } = product;

    const { unitcostprice: retailcost, wholesalecostprice: wholesalecost } = priceconfiguration[0];

    this.purchaseOrderFormTwo.patchValue({
      retailcost,
      wholesalecost
    });
  }
}
