import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from './grn.service';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierService } from '@app/supplier/supplier.service';
import { SharedService } from '../shared/shared.service';
const log = new Logger('home');

export interface PurchaseOrderElement {
  position: number;
  invoiceNumber: string;
}

const PURCHASE_ORDER_TABLE_DATA: PurchaseOrderElement[] = [];

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss']
})
export class GrnComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public title = 'GRN';
  public breadcrumbItem: any = [
    {
      title: 'GRN',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private purchaseOrderService: PurchaseOrderService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.orderType = 0;
    this.dataSource.paginator = this.paginator;
    this.getPurchaseOrders();
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

  getPurchaseOrders() {
    this.loader = true;
    const searchData = { searchtype: 0 };
    this.purchaseOrderService
      .getGrns(searchData)
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
            this.sharedService.nextPurchaseOrders(this.purchaseOrders);
            this.dataSource.data = this.purchaseOrders
              .filter(order => order.doctypeId === 6)
              .map((order, index) => {
                const {
                  invoiceNumber,
                  dateCreated,
                  dueDate,
                  totalCostPrice,
                  doctypeId,
                  transactionstatus: transactionStatus,
                  transactionstatusId: transactionStatusId,
                  supplier: { companyname: supplierName }
                } = order;
                return {
                  position: index + 1,
                  invoiceNumber,
                  dateCreated,
                  dueDate,
                  doctypeId,
                  transactionStatusId,
                  transactionStatus,
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
