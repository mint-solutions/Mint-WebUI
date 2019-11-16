import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from './supplier.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';

const log = new Logger('home');

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  supplierForm: FormGroup;

  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;

  selectedRow: any;
  formLoading = false;
  suppliers: any[] = [];
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Supplier';
  public breadcrumbItem: any = [
    {
      title: 'Supplier',
      cssClass: 'active'
    }
  ];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.getSuppliers();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getSuppliers() {
    this.loader = true;
    this.supplierService
      .getsuppliers()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getCountries', res);
          if (res.status === true) {
            this.suppliers = res.result;
            console.log(res);
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

  onViewRow(data: any, mode?: string) {
    console.log(data, mode);
  }

  onEdit(data: any, mode: any) {
    this.supplierForm.patchValue({ name: data.name });
  }

  onDelete(data: any, doDelete: any) {
    this.selectedRow = data;
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete(event: any) {
    this.formLoading = true;
  }
}
