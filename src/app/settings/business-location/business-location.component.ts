import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';

import { DataTableDirective } from 'angular-datatables';
import { finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BusinessLocationService } from './business-location.service';
import { BusinessLocationModel } from './business-location.model';

const log = new Logger('home');

@Component({
  selector: 'app-business-location',
  templateUrl: './business-location.component.html',
  styleUrls: ['./business-location.component.scss']
})
export class BusinessLocationComponent implements OnInit {
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;
  bussinessLocations: BusinessLocationModel[];
  businessLocationForm: FormGroup;
  mode: string = 'Create';
  formLoading = false;
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Business Location';
  public breadcrumbItem: any = [
    {
      title: 'Business Location',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private formBuilder2: FormBuilder,
    private modalService: NgbModal,
    private categoryService: BusinessLocationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getBusinessLocation();
  }

  getBusinessLocation() {
    this.loader = true;
    this.categoryService
      .getBusinessLocations()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getCountries', res);
          if (res.status === true) {
            this.bussinessLocations = res.result;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onSubmit() {
    this.formLoading = true;

    if (this.businessLocationForm.valid) {
      const data = {
        ...this.businessLocationForm.value
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

  onEdit(data: any, mode: any) {
    this.mode = 'Update';
    this.selectedRow = data;
    this.businessLocationForm.patchValue({ name: this.selectedRow.name, address: this.selectedRow.address });
  }

  onCreate(data: any) {
    console.log(data);

    this.categoryService
      .createBusinessLocation(data)
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
          this.getBusinessLocation();
          this.toastr.success(res.message, 'Category');
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

    this.categoryService
      .updateBusinessLocation(payload)
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
          this.getBusinessLocation();
          this.toastr.success(res.message, 'Category');
        },
        error => serverError(error, this.toastr)
      );
  }

  onDelete(category: any, doDelete: any) {
    this.selectedRow = category;
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete(event: any) {
    this.formLoading = true;

    this.categoryService
      .deleteBusinessLocation(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.modalService.dismissAll();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            this.bussinessLocations = removeDeletedItem(this.bussinessLocations, this.selectedRow.id);
            this.toastr.success(res.message, 'Category');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  onViewRow(event: any, category: any, mode: null) {
    this.businessLocationForm.reset();

    const selectedRow = event;
    this.selectedRow = selectedRow;
    this.mode = mode;

    this.modalRef = this.modalService.open(category, {
      windowClass: 'search',
      backdrop: false
    });
  }

  createForm() {
    this.businessLocationForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  resetForm() {
    this.businessLocationForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }

  d(data: any) {
    this.resetForm();
  }
}
