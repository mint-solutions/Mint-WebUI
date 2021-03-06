import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { componentError, serverError, removeDeletedItem } from '@app/helper';
import { CategoryService } from './category.service';
import { DataTableDirective } from 'angular-datatables';
import { finalize } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
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
  dtTrigger2: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  modalTitle = 'Subcategory';
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  selectedRow: any;
  selectedSubcategory: any;

  categoryForm: FormGroup;
  subcategoryForm: FormGroup;
  categories: any[] = [];
  mode: string = 'Create';
  formLoading = false;
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
    private formBuilder2: FormBuilder,
    private modalService: NgbModal,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.dtTrigger.next();

    this.createForm();
    this.createSubForm();
    this.getCategories();
  }

  ngAfterViewInit(): void {
    this.dtTrigger2.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }

  getCategories() {
    this.loader = true;
    this.categoryService
      .getCategories()
      .pipe(
        finalize(() => {
          this.dtTrigger.unsubscribe();
          this.dtTrigger2.unsubscribe();
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getCountries', res);
          if (res.status === true) {
            this.categories = res.result;
            this.dtTrigger.next();
            this.dtTrigger2.next();
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
    this.selectedRow = data;
    this.categoryForm.patchValue({ name: this.selectedRow.name });
  }

  onCreate(data: any) {
    console.log(data);

    this.categoryService
      .createCategory(data)
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
          this.getCategories();
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
      .updateCategory(payload)
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
          this.getCategories();
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

  onViewRow(event: any, category: any, mode: null) {
    this.categoryForm.reset();
    this.createSubForm();

    const selectedRow = event;
    this.selectedRow = selectedRow;
    this.mode = mode;

    this.modalRef = this.modalService.open(category, {
      windowClass: 'search',
      backdrop: false
    });
  }

  onSubmitSubcategory() {
    this.formLoading = true;

    console.log(this.subcategoryForm.value);

    if (this.subcategoryForm.valid) {
      const data = {
        categoryId: this.selectedRow.id,
        name: this.subcategoryForm.value.newname
      };
      switch (this.mode) {
        case 'Create':
          this.onCreateSubcategory(data);
          break;
        case 'Update':
          this.onUpdateSubcategory(data);
          break;
      }
    }
  }

  onEditSubcategory(data: any, mode: any) {
    this.mode = 'Update';
    this.selectedSubcategory = data;
    this.subcategoryForm.patchValue({ newname: this.selectedSubcategory.name });
  }

  onCreateSubcategory(data: any) {
    console.log(data);

    this.categoryService
      .createSubcategory(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.modalService.dismissAll();
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.loader = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.getCategories();
          this.toastr.success(res.message, 'subcategory');
        },
        error => serverError(error, this.toastr)
      );
  }
  onUpdateSubcategory(data: any) {
    console.log('onUpdate', data);
    const payload = {
      ...data,
      id: this.selectedSubcategory.id
    };

    this.categoryService
      .updateSubcategory(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
          this.modalService.dismissAll();
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

  onDeleteSubcategory(category: any, doDelete: any) {
    this.selectedSubcategory = category;
    console.log(this.selectedSubcategory);
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDeleteSubcategory(event: any) {
    this.formLoading = true;

    this.categoryService
      .deleteSubcategory(this.selectedSubcategory.id)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.modalService.dismissAll();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            // console.log('onDoDeleteSubcategory');
            // this.selectedRow.subcategory = removeDeletedItem(this.selectedRow.subcategory, this.selectedSubcategory.id);
            this.toastr.success(res.message, 'Subcategory');
            this.getCategories();
          } else {
            componentError(res.message, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  createForm() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
      // remember: true
    });
  }

  createSubForm() {
    this.subcategoryForm = this.formBuilder2.group({
      newname: ['', Validators.required]
      // remember: true
    });
  }

  resetForm() {
    this.categoryForm.reset();
    this.subcategoryForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }

  d(data: any) {
    this.resetForm();
  }
}
