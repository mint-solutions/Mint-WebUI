import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';
import { DataTableDirective } from 'angular-datatables';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from '../supplier.service';
import { Router } from '@angular/router';

const log = new Logger('home');

@Component({
  selector: 'app-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.scss']
})
export class SupplierCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  modalTitle = 'supplier';
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  supplierForm: FormGroup;
  formLoading = false;
  suppliers: any[] = [];
  mode: string = 'Create';
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Create New supplier';
  public breadcrumbItem: any = [
    {
      title: 'Create New supplier',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private supplierService: SupplierService,
    private route: Router
  ) {}

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  onSubmit() {
    this.formLoading = true;

    if (this.supplierForm.valid) {
      const data = {
        ...this.supplierForm.value
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
    console.log(data);

    this.supplierService
      .createsupplier(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Supplier');
          this.resetForm();
          this.route.navigate(['/', 'supplier', 'view']);
        },
        error => serverError(error, this.toastr)
      );
  }
  onUpdate(data: any) {
    console.log('onUpdate', data);
    const payload = {
      ...data,
      id: this.selectedRow.id
    };

    this.supplierService
      .updatesupplier(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Supplier');
        },
        error => serverError(error, this.toastr)
      );
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.supplierForm = this.formBuilder.group({
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobilenumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  resetForm() {
    this.supplierForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}