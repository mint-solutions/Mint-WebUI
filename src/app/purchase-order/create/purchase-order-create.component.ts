import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../purchase-order.service';
import { SupplierService } from '@app/supplier/supplier.service';
import { BusinessLocationService } from '@app/settings/business-location/business-location.service';
import { WarehouseService } from '@app/settings/warehouse/warehouse.service';
import { ProductService } from '../../product/product.service';

const log = new Logger('home');

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.scss'],
  providers: [ProductService]
})
export class PurchaseOrderCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  cardTitle = 'New Purchase Order';
  purchaseOrderFormOne: FormGroup;
  purchaseOrderFormTwo: FormGroup;
  formLoading: boolean;
  loader: boolean;
  suppliersLoader: boolean;
  products: any[] = [];

  mode: string = 'Create';

  selectedRow: any;

  packings: any[] = [];
  suppliers: any[] = [];
  subcategories: any[] = [];
  businessLocations: any[] = [];
  warehouses: any[] = [];

  public sidebarVisible = true;
  public title = 'Create New Purchase Order';
  public breadcrumbItem: any = [
    {
      title: 'Create New Purchase Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: Router,
    private purchaseOrderService: PurchaseOrderService,
    private businessLocationService: BusinessLocationService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private warehouseService: WarehouseService
  ) {
    if (this.route.getCurrentNavigation() != null) {
      this.selectedRow = this.route.getCurrentNavigation().extras.state;
      console.log('state', this.selectedRow);
    }
  }

  ngOnInit() {
    //this.getPackings();
    this.getSuppliers();
    this.createForm();
    this.getBusinessLocations();
    this.getProducts();
    if (this.selectedRow && this.selectedRow.mode === 'edit') {
      this.mode = 'Update';
      this.cardTitle = 'Edit Purchase Order';
      this.purchaseOrderFormTwo.patchValue({
        supplierId: this.selectedRow.supplierId,
        shiptobusinessId: this.selectedRow.shiptobusinessId,
        duedate: this.selectedRow.duedate
      });
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy() {}

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

  getWarehouses(data: any) {
    this.loader = true;
    this.warehouseService
      .getwarehousebybusinesslocationId(data.target.value)
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
      const unitquantity = this.purchaseOrderFormTwo.value.unitquantity;
      const ctnquantity = this.purchaseOrderFormTwo.value.ctnquantity;
      const retailcost = this.purchaseOrderFormTwo.value.retailcost;
      const wholesalecost = this.purchaseOrderFormTwo.value.wholesalecost;
      const linewholesalecost = wholesalecost * ctnquantity;
      const lineretailcost = retailcost * unitquantity;

      const purchaseItems = [
        {
          unitquantity,
          ctnquantity,
          retailcost,
          wholesalecost,
          linewholesalecost,
          lineretailcost
        }
      ];
      const data = {
        supplierId: this.purchaseOrderFormTwo.value.supplierId,
        invoiceNumber: this.purchaseOrderFormTwo.value.invoiceNumber,
        shiptobusinessId: this.purchaseOrderFormTwo.value.shiptobusinessId,
        warehouseId: this.purchaseOrderFormTwo.value.warehouseId,
        duedate: this.purchaseOrderFormTwo.value.duedate,
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
          this.route.navigate(['/', 'purchaseOrder', 'view']);
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

    this.purchaseOrderService
      .updatePurchaseOrder(payload)
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
          this.route.navigate(['/', 'purchaseOrder', 'view']);
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
      ctnquantity: ['', [Validators.required]],
      unitquantity: [{ value: '0' }, [Validators.required]],
      warehouseId: ['', [Validators.required]],
      wholesalecost: ['', [Validators.required]],
      retailcost: ['', [Validators.required]]
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
