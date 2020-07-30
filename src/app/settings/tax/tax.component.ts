import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';

import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TaxService } from './tax.service';
import { TaxModel } from './tax.model';

const log = new Logger('home');

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;
  tax: TaxModel[];
  taxes: any[];
  taxForm: FormGroup;
  mode = 'Create';
  formLoading = false;
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Tax Settings';
  public breadcrumbItem: any = [
    {
      title: 'Tax Setings',
      cssClass: 'active'
    }
  ];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private taxService: TaxService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAllTax();
  }

  getAllTax() {
    this.loader = true;
    this.taxService
      .getAllTax()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('res', res);
          if (res.status === true) {
            this.taxes = res.result;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => {
          console.log('errorss', error);
          serverError(error, this.toastr);
        }
      );
  }

  onSubmit() {
    this.formLoading = true;

    if (this.taxForm.valid) {
      const data = {
        ...this.taxForm.value
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
    this.taxForm.patchValue({ name: this.selectedRow.name, address: this.selectedRow.address });
  }

  onCreate(data: any) {
    console.log(data);
    this.taxService
      .createTax(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          console.log('res', res);
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.getAllTax();
          this.toastr.success(res.message, 'Success');
        },
        error => {
          console.log('create error', error);
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

    this.taxService
      .updateTax(payload)
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
          this.getAllTax();
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

  onGetTaxes(tax: any, locationModal: any) {
    this.selectedRow = tax;
    this.modalRef = this.modalService.open(locationModal, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete(event: any) {
    this.formLoading = true;

    this.taxService
      .deleteTax(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.modalService.dismissAll();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            this.taxes = removeDeletedItem(this.taxes, this.selectedRow.id);
            this.toastr.success(res.message, 'Success');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  onViewRow(event: any, category: any, mode: null) {
    this.taxForm.reset();

    const selectedRow = event;
    this.selectedRow = selectedRow;
    this.mode = mode;

    this.modalRef = this.modalService.open(category, {
      windowClass: 'search',
      backdrop: false
    });
  }

  createForm() {
    this.taxForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  resetForm() {
    this.taxForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }

  d(data: any) {
    this.resetForm();
  }
}
