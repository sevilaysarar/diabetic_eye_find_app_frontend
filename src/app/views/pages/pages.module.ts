import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { AlertModule, BadgeModule, ButtonModule, CardModule, FormModule, GridModule, ModalModule, PopoverModule, ProgressModule, SharedModule, ToastModule, TooltipModule, UtilitiesModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NotificationsRoutingModule } from '../notifications/notifications-routing.module';
import { DocsComponentsModule } from '@docs-components/docs-components.module';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    Page404Component,
    Page500Component
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,

    NotificationsRoutingModule,
    DocsComponentsModule,
    AlertModule,
    BadgeModule,
    ToastModule,
    SharedModule,
    UtilitiesModule,
    TooltipModule,
    PopoverModule,
    ProgressModule,
    IconModule,
    ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    })
  ]
})
export class PagesModule {
}
