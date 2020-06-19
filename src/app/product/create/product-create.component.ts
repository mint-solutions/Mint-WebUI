import { ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
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
export class ProductCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  cardTitle = 'New Product';
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
    if (this.selectedRow && this.selectedRow.mode === 'edit') {
      this.mode = 'Update';
      this.cardTitle = 'Edit Category';
      this.productForm.patchValue({
        name: this.selectedRow.name,
        itemcode: this.selectedRow.itemcode,
        description: this.selectedRow.description,
        packingtype: this.selectedRow.packingtype,
        pack: this.selectedRow.pack,
        categoryId: this.selectedRow.category.id,
        subcategoryId: this.selectedRow.subCategory ? this.selectedRow.subCategory.id : null,
        expiredenabled: this.selectedRow.expiredenabled
      });
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
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
          if (res.status === true) {
            this.packings = res.result;
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
    console.log('this.mode', this.mode);

    if (this.productForm.valid) {
      const data = {
        name: this.productForm.value.name,
        itemcode: this.productForm.value.itemcode,
        description: this.productForm.value.description,
        categoryId: this.productForm.value.categoryId,
        subcategoryId: this.productForm.value.subcategoryId
        /*  productconfiguration: {
          pack: +this.productForm.value.pack,
          expiredenabled: this.productForm.value.canbepurchased,
          leadtime: +this.productForm.value.leadtime,
          canexpire: this.productForm.value.canexpire,
          canbesold: this.productForm.value.canbesold,
          canbepurchased: this.productForm.value.canbepurchased,
          anypromo: this.productForm.value.anypromo,
          imagelink: this.productForm.value.imagelink
        } */
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
      .updateproduct(payload)
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
          this.route.navigate(['/', 'product', 'view']);
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
      categoryId: ['', Validators.required],
      description: [''],
      subcategoryId: ['']
      /* leadtime: [0],
      imagelink: [''],
      pack: [''],
      canexpire: [false],
      canbesold: [false],
      canbepurchased: [false],
      anypromo: [false] */
    });
  }

  resetForm() {
    this.productForm.reset();
    this.mode = 'Create';
    this.selectedRow = {};
  }
}
