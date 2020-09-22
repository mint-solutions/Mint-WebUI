import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../grn.service';
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
  name: string;
  position: number;
  itemCode: number;
  wholesaleCost: number;
  retailCost: number;
  productId: number;
  ctnQuantity: number;
  unitQuantity: number;
  suppliedQuantity: number;
  pack: number;
}

const PRODUCT_TABLE_DATA: SelectedElement[] = [];
const SELECTED_TABLE_DATA: SelectedElement[] = [];

let TEMP_SELECTION: string;

@Component({
  selector: 'grn-modal',
  templateUrl: 'grn-modal.html',
  styleUrls: ['./grn-update.component.scss']
})
export class GrnModalComponent {
  constructor(
    public dialogRef: MatDialogRef<GrnModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectedElement
  ) {}

  onNoClick(data: SelectedElement): void {
    const tempSelection = JSON.parse(TEMP_SELECTION);
    Object.keys(data).forEach(key => {
      data[key] = tempSelection[key];
    });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-grn-update',
  templateUrl: './grn-update.component.html',
  styleUrls: ['./grn-update.component.scss'],
  providers: [ProductService]
})
export class GrnUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  products: any[] = [];
  dataSource = new MatTableDataSource<SelectedElement>(PRODUCT_TABLE_DATA);
  selectedSource = new MatTableDataSource<SelectedElement>(SELECTED_TABLE_DATA);
  displayedColumns: string[] = ['select', 'position', 'itemCode', 'name', 'pack'];
  displayedSelectedColumns: string[] = [
    'position',
    'name',
    'pack',
    'ctnQuantity',
    'unitQuantity',
    'suppliedQuantity',
    'action'
  ];
  selection = new SelectionModel<SelectedElement>(true, []);
  sharedServiceSubsscription: Subscription;

  cardTitle = 'Edit GRN';
  purchaseOrderFormOne: FormGroup;
  purchaseOrderFormTwo: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;
  mode: string = 'Create';
  purchaseOrder: any[] = [];

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];
  businessLocations: any[] = [];
  warehouses: any[] = [];

  public sidebarVisible = true;
  public title = 'Edit GRN';
  public breadcrumbItem: any = [
    {
      title: 'Edit GRN',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
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
    this.getSuppliers();
    this.createForm();
    this.getBusinessLocations();
    this.getProducts();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy() {}

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

  openDialog(data: any): void {
    TEMP_SELECTION = JSON.stringify(data);
    const dialogRef = this.modal.open(GrnModalComponent, {
      width: '500px',
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      // Do nothing
    });
  }

  getParams() {
    this.routes.params.subscribe(params => {
      const { invoiceNumber } = params;
      if (!invoiceNumber) {
        return;
      }
      this.getPurchaseOrderByInvoiceNumber(invoiceNumber);
    });
  }

  getPurchaseOrderByInvoiceNumber(invoiceNumber: string) {
    this.sharedServiceSubsscription = this.sharedService.sharedPurchaseOrders.subscribe(purchaseOrders => {
      this.purchaseOrder = purchaseOrders.filter(purchaseOrder => purchaseOrder.invoiceNumber === invoiceNumber);
      if (!this.purchaseOrder.length) {
        this.router.navigateByUrl('/grn/view');
        return;
      }

      this.title = `Update Purchase Order`;
      this.mode = 'Update';
      this.cardTitle = 'Edit Purchase Order';
      console.log('purchaseOrder update', this.purchaseOrder);
      const {
        supplier: { id: supplierId },
        dueDate: duedate,
        shipbusinesslocation: { id: shiptobusinessId },
        warehouse: { id: warehouseId }
      } = this.purchaseOrder[0];
      const data = { invoiceNumber, supplierId, shiptobusinessId, warehouseId, duedate };
      console.log('datas', data);
      this.getWarehouses(shiptobusinessId);
      this.purchaseOrderFormTwo.patchValue({
        supplierId,
        invoiceNumber,
        duedate,
        shiptobusinessId,
        warehouseId
      });

      this.dataSource.data = this.dataSource.data
        .filter(item => {
          return this.purchaseOrder[0].orderitem.find((x: any) => x.product.id === item.productId);
        })
        .map(item => ({ ...item, suppliedQuantity: 0 }));

      this.purchaseOrder[0].orderitem.forEach((item: any) => {
        const {
          product: {
            name,
            itemcode: itemCode,
            id: { productId }
          },
          unitqty: unitQuantity,
          ctnqty: ctnQuantity,
          wholesalecost: wholesaleCost,
          retailcost: retailCost
        } = item;
        const validProduct = this.dataSource.data.find(product => product.productId === item.product.id);
        if (validProduct) {
          validProduct.wholesaleCost = wholesaleCost;
          validProduct.ctnQuantity = ctnQuantity;
          validProduct.itemCode = itemCode;
          validProduct.unitQuantity = unitQuantity;
          validProduct.retailCost = retailCost;
          validProduct.suppliedQuantity = ctnQuantity;

          this.selection.select(validProduct);
        }
      });
    });

    this.cdr.detectChanges();
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

  getBusinessLocations() {
    this.loader = true;
    this.businessLocationService
      .getMyBusinessLocations()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getMyBusinessLocations', res);
          if (res.status === true) {
            this.businessLocations = res.result;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onGetWarehouses(event: any) {
    this.getWarehouses(event.target.value);
  }

  getWarehouses(businessLoacationId: number) {
    this.loader = true;
    this.warehouseService
      .getWarehouseByBusinessLocationId(businessLoacationId)
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getWarehouses', res);
          if (res.status === true) {
            this.warehouses = res.result;
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
      .getProductsForPurchase()
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
              const {
                name,
                itemcode: itemCode,
                id: productId,
                productconfiguration: { pack }
              } = product;
              const { priceconfiguration } = product;
              const { unitcostprice: retailCost, wholesalecostprice: wholesaleCost } = priceconfiguration[0];
              return {
                position,
                name,
                itemCode,
                retailCost,
                wholesaleCost,
                productId,
                pack,
                unitQuantity: 0,
                ctnQuantity: 0,
                suppliedQuantity: 0
              };
            });

            this.getParams();
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
        const { productId: productid, suppliedQuantity: suppliedqty } = selected;
        return {
          productid,
          suppliedqty
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
    this.purchaseOrderService
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
          this.router.navigate(['/', 'purchaseOrder', 'view']);
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

    this.purchaseOrderService
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
          this.router.navigate(['/', 'purchaseOrder', 'view']);
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
