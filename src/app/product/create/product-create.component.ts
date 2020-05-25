import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { finalize } from 'rxjs/operators';
import { componentError, serverError } from '@app/helper';
import { Router } from '@angular/router';
import { CategoryService } from '@app/category/category.service';

const log = new Logger('home');

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  formLoading: boolean;
  loader: boolean;

  mode: string = 'Create';

  selectedRow: any;

  packings: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];

  public sidebarVisible = true;
  public title = 'Create New Product';
  public breadcrumbItem: any = [
    {
      title: 'Create New Product',
      cssClass: 'active'
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    if (this.route.getCurrentNavigation() != null) {
      this.selectedRow = this.route.getCurrentNavigation().extras.state;
      console.log('state', this.selectedRow);
    }
  }

  ngOnInit() {
    this.getPackings();
    this.getCategories();
    this.createForm();

    if (this.selectedRow !== null && this.selectedRow.mode === 'edit') {
      this.productForm.setValue({
        name: this.selectedRow.name,
        itemcode: this.selectedRow.itemcode,
        description: this.selectedRow.description,
        packingtype: this.selectedRow.packingtype,
        packs: this.selectedRow.packs,
        categoryId: this.selectedRow.categoryId,
        subcategoryId: this.selectedRow.subcategoryId,
        expiredenabled: false
      });
      console.log('this.selectedRow', this.selectedRow);
      console.log('this.productForm.value', this.productForm.value);
    }
  }

  ngOnDestroy() {}

  getPackings() {
    this.loader = true;
    this.productService
      .getPacking()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(
        res => {
          console.log('getPackings', res);
          this.packings = res;
          if (res.status === true) {
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
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
          console.log('getCategories', res);
          if (res.status === true) {
            this.categories = res.result;
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onSubmit() {
    this.formLoading = true;

    if (this.productForm.valid) {
      const data = {
        ...this.productForm.value,
        packs: +this.productForm.value.packs
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

    this.productService
      .createProduct(data)
      .pipe(
        finalize(() => {
          this.formLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Product');
          this.resetForm();
          this.route.navigate(['/', 'product', 'view']);
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

    this.productService
      .createProduct(payload)
      .pipe(
        finalize(() => {
          this.formLoading = false;
          this.resetForm();
        })
      )
      .subscribe(
        (res: any) => {
          this.formLoading = false;
          if (res.status !== true) {
            return componentError(res.message, this.toastr);
          }
          this.toastr.success(res.message, 'Supplier');
        },
        error => serverError(error, this.toastr)
      );
  }

  setSubcategoryId(data: any) {
    console.log(data.target.value);
    const subcategory = this.categories
      .filter((category: any) => category.id === data.target.value)
      .map((selectedCategory: any) => selectedCategory.subcategory)[0];

    this.subcategories = subcategory;
  }

  createForm(formMode: any = null) {
    let isDisabled = formMode === 'view' ? true : false;

    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      itemcode: ['', [Validators.required]],
      description: [''],
      packingtype: ['', Validators.required],
      packs: ['', Validators.required],
      expiredenabled: [false],
      categoryId: ['', Validators.required],
      subcategoryId: ['']
    });
  }

  resetForm() {
    this.productForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
