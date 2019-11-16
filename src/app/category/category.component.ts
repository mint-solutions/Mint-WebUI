import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';
import { CategoryService } from './category.service';
import { DataTableDirective } from 'angular-datatables';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('home');

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { read: false })
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalTitle = 'Subcategory';
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;

  categoryForm: FormGroup;
  formLoading = false;
  categories: any[] = [];
  mode: string = 'Create';
  loader: boolean;

  public sidebarVisible = true;
  public title = 'Category';
  public breadcrumbItem: any = [
    {
      title: 'Category',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.createForm();
    this.getCategories();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getCategories() {
    this.loader = true;
    this.categoryService
      .getCategories()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getCountries', res);
          if (res.status === true) {
            this.categories = res.result;
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

  onSubmit() {
    this.formLoading = true;

    if (this.categoryForm.valid) {
      const data = {
        ...this.categoryForm.value
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
    this.categoryForm.patchValue({ name: data.name });
  }

  onCreate(data: any) {
    console.log(data);

    this.categoryService
      .createCategory(data)
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
          this.getCategories();
          this.toastr.success(res.message, 'Category');
        },
        error => serverError(error, this.toastr)
      );
  }
  onUpdate(data: any) {
    console.log(data);
    const payload = {
      ...data,
      id: this.selectedRow.id
    };

    this.categoryService
      .updateCategory(payload)
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
          this.getCategories();
          this.toastr.success(res.message, 'Category');
        },
        error => serverError(error, this.toastr)
      );
  }

  onDelete(user: any, doDelete: any) {
    this.selectedRow = user;
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
      .deleteCategory(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.modalService.dismissAll();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            this.categories = removeDeletedItem(this.categories, this.selectedRow.id);
            this.toastr.success(res.message, 'Category');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  onViewRow(event: any, category: any, viewCountry: null) {
    const selectedRow = event;
    this.selectedRow = selectedRow;

    this.modalTitle = `Update Wallet - ${this.selectedRow.name}`;
    this.createForm();

    if (viewCountry === 'VIEW') {
      // this.createForm(viewCountry);

      this.modalTitle = `View Walet - ${this.selectedRow.name}`;
    }

    this.modalRef = this.modalService.open(category, {
      windowClass: 'search',
      backdrop: false
    });
  }

  createForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
      // remember: true
    });
  }

  resetForm() {
    this.categoryForm.reset();
    this.mode = 'Create';
  }
}
