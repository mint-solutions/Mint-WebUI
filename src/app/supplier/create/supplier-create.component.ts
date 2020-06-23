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
  modalTitle = 'Supplier';
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
      title: 'Create New Supplier',
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
  ) {
    if (this.route.getCurrentNavigation() != null) {
      this.selectedRow = this.route.getCurrentNavigation().extras.state;
    }
  }

  ngOnInit() {
    this.createForm();
    if (this.selectedRow && this.selectedRow.mode === 'edit') {
      this.title = 'Update supplier';
      this.mode = 'Update';
      this.breadcrumbItem[0].title = 'Edit Supplier';
      this.supplierForm.patchValue({
        company: this.selectedRow.companyname,
        mobilenumber: this.selectedRow.mobilenumber,
        email: this.selectedRow.email,
        address: this.selectedRow.address,
        website: this.selectedRow.website,
        contactpersonname: this.selectedRow.contactpersonname,
        contactpersonphonenumber: this.selectedRow.contactpersonphonenumber,
        contactpersonemail: this.selectedRow.contactpersonemail,
        street: this.selectedRow.street,
        stateId: this.selectedRow.stateId,
        facebooklink: this.selectedRow.facebook,
        instagramlink: this.selectedRow.instagram,
        twitterlink: this.selectedRow.twitter,
        accountId: this.selectedRow.accountId
      });
    }
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
      mobilenumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      website: ['', Validators.required],
      contactpersonname: ['', Validators.required],
      contactpersonphonenumber: ['', Validators.required],
      contactpersonemail: ['', Validators.required],
      street: ['', Validators.required],
      stateId: ['', Validators.required],
      facebooklink: [''],
      instagramlink: [''],
      twitterlink: [''],
      accountId: ['', Validators.required]
    });
  }

  resetForm() {
    this.supplierForm.reset();
    this.mode = 'Create';
    this.title = 'Create New supplier';
    this.breadcrumbItem[0].title = 'Create New Supplier';
    this.selectedRow = {};
  }
}
