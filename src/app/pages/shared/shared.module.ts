import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { NbSpinnerModule } from '@nebular/theme';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidemenuComponent } from './components/right-sidemenu/right-sidemenu.component';
import { ImageUploadingComponent } from './components/image-uploading/image-uploading.component';


@NgModule({
  declarations: [
    OrderListComponent,
    BreadcrumbComponent,
    RightSidemenuComponent,
    NotFoundComponent,
    ImageUploadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    Ng2SmartTableModule,
    ThemeModule,
    NbSpinnerModule,
    TranslateModule
  ],
  exports: [
    Ng2SmartTableModule,
    ThemeModule,
    NbSpinnerModule,
    TranslateModule,

    OrderListComponent,
    BreadcrumbComponent,
    RightSidemenuComponent,
    NotFoundComponent,
    ImageUploadingComponent
  ]
})
export class SharedModule {
}
