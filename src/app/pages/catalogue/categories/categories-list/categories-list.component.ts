import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { CategoryService } from '../services/category.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonRenderComponent } from './button-render.component';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../products/services/product.service';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  categories = [];
  settings = {};

  // paginator
  perPage = 15;
  currentPage = 1;
  totalCount;
  roles;
  searchValue: string = '';

  // request params
  params = this.loadParams();

  availableList: any[];
  selectedList: any[];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private productService: ProductService,
    private storageService: StorageService,

  ) {
    this.roles = JSON.parse(localStorage.getItem('roles'));
  }

  loadParams() {
    return {
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }

  ngOnInit() {
    this.getList();
    this.productService.getListOfProducts({})
      .subscribe(res => {
        this.availableList = [...res.products];
        this.selectedList = [];
      });
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  // creating array of categories include children
  //specific to category
  getChildren(node) {
    if (node.children && node.children.length !== 0) {
      this.categories.push(node);
      node.children.forEach((el) => {
        this.getChildren(el);
      });
    } else {
      this.categories.push(node);
    }
  }

  //specific to category
  getList() {
    this.categories = [];

    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.categoryService.getListOfCategories(this.params)
      .subscribe(categories => {
        categories.categories.forEach((el) => {
          this.getChildren(el);
        });
        this.totalCount = categories.totalPages;
        this.source.load(this.categories);
        this.loadingList = false;
      });
    this.setSettings();
  }

  setSettings() {
    this.settings = {
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: [
          { name: 'details', title: '<i class="nb-edit"></i>' },
          { name: 'remove', title: this._sanitizer.bypassSecurityTrustHtml('<i class="fas fa-trash-alt"></i>') }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        store: {
          title: this.translate.instant('STORE.MERCHANT_STORE'),
          type: 'string',
          filterFunction(cell: any, search?: string): boolean {
            console.log('Cell ' + cell);
            console.log('Search ' + search);
            return true;
          }
        },
        description: {
          title: this.translate.instant('CATEGORY.CATEGORY_NAME'),
          type: 'string',
          valuePrepareFunction: (description) => {
            if (description) {
              return description.name;
            }
          }
        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
        },
        parent: {
          title: this.translate.instant('CATEGORY.PARENT'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (parent) => {
            return parent ? parent.code : 'root';
          }
        },
        visible: {
          filter: false,
          title: this.translate.instant('COMMON.VISIBLE'),
          type: 'custom',
          renderComponent: ButtonRenderComponent,
          defaultValue: false,
        },
      },
    };
  }

  route(event) {
    switch (event.action) {
      case 'details':
        this.router.navigate(['pages/catalogue/categories/category/', event.data.id]);
        break;
      case 'remove':
        this.dialogService.open(ShowcaseDialogComponent, {})
          .onClose.subscribe(res => {
            if (res) {
              this.categoryService.deleteCategory(event.data.id)
                .subscribe(data => {
                  this.toastr.success(this.translate.instant('CATEGORY_FORM.CATEGORY_REMOVED'));
                  this.getList();
                });
            }
          });
    }
  }

  // paginator
  changePage(event) {
    switch (event.action) {
      case 'onPage': {
        this.currentPage = event.data;
        break;
      }
      case 'onPrev': {
        this.currentPage--;
        break;
      }
      case 'onNext': {
        this.currentPage++;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
      case 'onLast': {
        this.currentPage = event.data;
        break;
      }
    }
    this.getList();
  }

  createNew() {
    this.router.navigate(['pages/catalogue/categories/create-category']);
  }

  resetSearch() {
    this.searchValue = null;
    this.params = this.loadParams();
    this.getList();
  }

  onSearch(query: string = '') {

    if (query.length == 0) {
      this.searchValue = null;
      return;
    }

    this.params["name"] = query;
    this.getList();
    this.searchValue = query;

  }

}
