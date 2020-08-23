import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from './purchase-order.service';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierService } from '@app/supplier/supplier.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const log = new Logger('home');

export interface PurchaseOrderElement {
  position: number;
  invoiceNumber: string;
}

export interface OrderTypeDataElement {
  supplierId: string;
  startDate: string;
  endDate: string;
  suppliers: any;
  postedBy: string;
  invoiceNumber: string;
  cancel: boolean;
}

const PURCHASE_ORDER_TABLE_DATA: PurchaseOrderElement[] = [];

@Component({
  selector: 'supplier-search-modal',
  templateUrl: 'supplier-search-modal.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class SupplierSearchModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SupplierSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderTypeDataElement
  ) {}
  onNoClick(data: OrderTypeDataElement): void {
    data['cancel'] = true;
    this.dialogRef.close();
  }
}

@Component({
  selector: 'date-range-search-modal',
  templateUrl: 'date-range-search-modal.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class DateRangeSearchModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DateRangeSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderTypeDataElement
  ) {}

  onNoClick(data: OrderTypeDataElement): void {
    data['cancel'] = true;
    this.dialogRef.close();
  }
}

@Component({
  selector: 'invoice-number-search-modal',
  templateUrl: 'invoice-number-search-modal.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class InvoiceNumberSearchModalComponent {
  constructor(
    public dialogRef: MatDialogRef<InvoiceNumberSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderTypeDataElement
  ) {}

  onNoClick(data: OrderTypeDataElement): void {
    data['cancel'] = true;
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  purchaseOrders: any[] = [];
  purchaseOrderForm: FormGroup;
  formLoading: boolean;
  loader: boolean;
  orderType: number;
  orderTypeData: OrderTypeDataElement = {
    supplierId: '',
    suppliers: [],
    startDate: '',
    endDate: '',
    cancel: false,
    postedBy: '',
    invoiceNumber: ''
  };

  dataSource = new MatTableDataSource<PurchaseOrderElement>(PURCHASE_ORDER_TABLE_DATA);
  displayedColumns: string[] = [
    'position',
    'invoiceNumber',
    'supplierName',
    'status',
    'dateCreated',
    'dueDate',
    'actions'
  ];

  public sidebarVisible = true;
  public title = 'Purchase Order';
  public breadcrumbItem: any = [
    {
      title: 'Purchase Order',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private router: Router,
    public modal: MatDialog
  ) {}

  ngOnInit() {
    this.orderType = 0;
    this.dataSource.paginator = this.paginator;
    this.getPurchaseOrders();
    this.getSuppliers();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onHandleRadioChange({ value }: any) {
    this.orderType = parseInt(value, 10);
    const dialogTypes = ['1', '2', '3'];
    if (dialogTypes.includes(value)) {
      return this.openDialog();
    }
    this.getPurchaseOrders();
  }

  openDialog(): void {
    this.orderTypeData.cancel = false;
    const dialogRef = this.modal.open(
      this.orderType === 1
        ? InvoiceNumberSearchModalComponent
        : this.orderType === 2
        ? SupplierSearchModalComponent
        : DateRangeSearchModalComponent,
      {
        width: '500px',
        data: this.orderTypeData
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result.cancel) {
        return;
      }
      this.getPurchaseOrders();
    });
  }

  getSuppliers() {
    this.supplierService
      .getsuppliers()
      .pipe(finalize(() => {}))
      .subscribe(
        res => {
          console.log('getSuppliers', res);
          if (res.status === true) {
            this.orderTypeData['suppliers'] = res.result;
            console.log(res);
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getPurchaseOrders() {
    this.loader = true;

    const searchData = this.getSearchData();

    console.log(searchData);

    this.purchaseOrderService
      .getPurchaseOrders(searchData)
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getPurchaseOrders', res);
          if (res.status === true) {
            this.purchaseOrders = res.result;
            this.dataSource.data = this.purchaseOrders.map((orders, index) => {
              const {
                invoiceNumber,
                dateCreated,
                dueDate,
                totalCostPrice,
                transactionstatusId: transactionStatusId,
                supplier: { companyname: supplierName }
              } = orders;
              return {
                position: index + 1,
                invoiceNumber,
                dateCreated,
                dueDate,
                transactionStatusId,
                totalCostPrice,
                supplierName
              };
            });
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  getSearchData() {
    const { startDate, endDate, supplierId, postedBy, invoiceNumber } = this.orderTypeData;

    return {
      postedBy,
      invoiceNumber,
      searchtype: this.orderType,
      supplierSearch: {
        supplierId,
        startDate,
        endDate
      },
      daterangeSearch: {
        startDate,
        endDate
      }
    };
  }

  onViewRow(event: any, modalView: any) {
    this.createForm();

    this.selectedRow = event;

    this.purchaseOrderForm.patchValue({
      supplierId: this.selectedRow.supplierId,
      invoiceNumber: this.selectedRow.invoiceNumber,
      shiptobusinessId: this.selectedRow.shiptobusinessId,
      duedate: this.selectedRow.duedate
    });

    this.modalRef = this.modalService.open(modalView, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'lg',
      windowClass: 'confirmModal'
    });
  }

  onViewDetails(event: any, modalView: any) {
    this.selectedRow = event;
    console.log(this.selectedRow);

    this.modalRef = this.modalService.open(modalView, {
      size: 'lg',
      windowClass: 'search'
    });
  }

  onEdit(data: any, mode: any) {
    data['mode'] = mode;

    console.log(data);

    this.router.navigateByUrl('/product/create', { state: data });
  }

  onDelete(data: any, doDelete: any) {
    this.selectedRow = data;

    console.log(this.selectedRow.id);
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete() {
    this.formLoading = true;

    this.purchaseOrderService
      .deletePurchaseOrder(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.doDeleteModalRef.close();
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.getPurchaseOrders();
          this.toastr.success(res.message, 'Product');
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.purchaseOrderForm = this.formBuilder.group({
      supplierId: ['', [Validators.required]],
      invoiceNumber: ['', [Validators.required]],
      shiptobusinessId: ['', [Validators.required]],
      duedate: ['', [Validators.required]]
    });
  }

  resetForm() {
    this.purchaseOrderForm.reset();
    this.selectedRow = {};
  }
}
