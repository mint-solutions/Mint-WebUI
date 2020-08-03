import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';

import { finalize } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from './warehouse.service';
import { WarehouseModel } from './warehouse.model';

import { BusinessLocationService } from '@app/settings/business-location/business-location.service';
import { BusinessLocationModel } from '@app/settings/business-location/business-location.model';

const log = new Logger('home');

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;
  warehouse: WarehouseModel[];
  warehouses: any[];
  warehouseForm: FormGroup;
  businessLocations: BusinessLocationModel[];
  mode = 'Create';
  formLoading = false;
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Warehouse Settings';
  public breadcrumbItem: any = [
    {
      title: 'Warehouse Setings',
      cssClass: 'active'
    }
  ];

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private warehouseService: WarehouseService,
    private businessLocationService: BusinessLocationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getAllWarehouses();
    this.getBusinessLocation();
  }

  getAllWarehouses() {
    this.loader = true;
    this.warehouseService
      .getAllWarehouses()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('res', res);
          if (res.status === true) {
            this.warehouses = res.result;
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

  getBusinessLocation() {
    this.loader = true;
    this.businessLocationService
      .getAllBusiness()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getBusinessLocation', res);
          if (res.status === true) {
            this.businessLocations = res.result[0].businessLocation;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onSubmit() {
    this.formLoading = true;

    if (this.warehouseForm.valid) {
      const data = {
        ...this.warehouseForm.value
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
    this.warehouseForm.patchValue({
      name: this.selectedRow.name,
      address: this.selectedRow.address,
      businesslocationId: this.selectedRow.businesslocationId
    });
  }

  onCreate(data: any) {
    console.log(data);
    this.warehouseService
      .createWarehouse(data)
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
          this.getAllWarehouses();
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
      id: this.selectedRow.id,
      isDisabled: false
    };

    this.warehouseService
      .updateWarehouse(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          console.log('update res', res);
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.getAllWarehouses();
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

  onGetWarehousees(warehouse: any, locationModal: any) {
    this.selectedRow = warehouse;
    this.modalRef = this.modalService.open(locationModal, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete(event: any) {
    this.formLoading = true;

    this.warehouseService
      .deleteWarehouse(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.modalService.dismissAll();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            this.warehouses = removeDeletedItem(this.warehouses, this.selectedRow.id);
            this.toastr.success(res.message, 'Success');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  onViewRow(event: any, category: any, mode: null) {
    this.warehouseForm.reset();

    const selectedRow = event;
    this.selectedRow = selectedRow;
    this.mode = mode;

    this.modalRef = this.modalService.open(category, {
      windowClass: 'search',
      backdrop: false
    });
  }

  createForm() {
    this.warehouseForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      businesslocationId: ['', Validators.required]
    });
  }

  resetForm() {
    this.warehouseForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }

  d(data: any) {
    this.resetForm();
  }
}
