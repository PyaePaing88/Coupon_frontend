import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { QrCodeModule } from 'ng-qrcode';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { CusHomeComponent } from './cus-home/cus-home.component';
import { CusAboutComponent } from './cus-about/cus-about.component';
import { CusCartComponent } from './cus-cart/cus-cart.component';
import { CusHistoryComponent } from './cus-history/cus-history.component';
import { CusBusinessComponent } from './cus-business/cus-business.component';
import { AdmHomeComponent } from './adm-home/adm-home.component';
import { AdmBusinessComponent } from './adm-business/adm-business.component';
import { AdmPackageComponent } from './adm-package/adm-package.component';
import { CusEditComponent } from './edit/cus-edit/cus-edit.component';
import { AdmRegisterComponent } from './adm-register/adm-register.component';
import { MyCouponComponent } from './my-coupon/my-coupon.component';
import { AdmSidebarComponent } from './adm-sidebar/adm-sidebar.component';
import { CusExploreComponent } from './cus-explore/cus-explore.component';
import { CusPackageComponent } from './cus-package/cus-package.component';
import { AdmCategorylistComponent } from './adm-categorylist/adm-categorylist.component';
import { AdmServicelistComponent } from './adm-servicelist/adm-servicelist.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { AdmUserListComponent } from './adm-user-list/adm-user-list.component';

import { AddBusinessCategoriesComponent } from './create/add-business-categories/add-business-categories.component';
import { AddBusinessServicesComponent } from './create/add-business-services/add-business-services.component';
import { CreateBusinessComponent } from './create/create-business/create-business.component';
import { CreatePackagesComponent } from './create/create-packages/create-packages.component';

import { EditBusinessComponent } from './edit/edit-business/edit-business.component';
import { EditPackagesComponent } from './edit/edit-packages/edit-packages.component';

import { BusinessHomeComponent } from './business-home/business-home.component';
import { BusinessSaleComponent } from './business-sale/business-sale.component';
import { ScannerComponent } from './scanner/scanner.component';
import { ScanHistoryComponent } from './scan-history/scan-history.component';

import { NotFoundComponent } from './not-found/not-found.component';
import { ServerDownpageComponent } from './server-downpage/server-downpage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { BusinessAboutComponent } from './business-about/business-about.component';
import { BusinessContactComponent } from './business-contact/business-contact.component';
import { AdmCouponSalelistComponent } from './adm-coupon-salelist/adm-coupon-salelist.component';
import { AdmFeedbackComponent } from './adm-feedback/adm-feedback.component';
import { AdmBusinessDetailsComponent } from './adm-business-details/adm-business-details.component';
import { CusProfileComponent } from './cus-profile/cus-profile.component';
import { AdmProfileComponent } from './adm-profile/adm-profile.component';
import { BusinessProfileComponent } from './business-profile/business-profile.component';
import { CusPaymentComponent } from './cus-payment/cus-payment.component';
import { CusCartPaymentComponent } from './cus-cart-payment/cus-cart-payment.component';
import { OauthRedirectComponent } from './oauth-redirect/oauth-redirect.component';
import { ContactComponent } from './cus-contact/cus-contact.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { CusReceiveListComponent } from './cus-receive-list/cus-receive-list.component';
import { CusTransferListComponent } from './cus-transfer-list/cus-transfer-list.component';
import { BusinessRegisterComponent } from './business-register/business-register.component';
import { BusinessPasswordResetComponent } from './business-password-reset/business-password-reset.component';
import { AdmPaymentRequestComponent } from './adm-payment-request/adm-payment-request.component';
import { OrderByConfirmPipe } from './pipe/order-by-confirm.pipe';
import { CusExpiredCouponComponent } from './cus-expired-coupon/cus-expired-coupon.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NotificationComponent } from './notification/notification.component';
import { AdmBusinessDeleteComponent } from './adm-business-delete/adm-business-delete.component';
import { AdmPackageDeleteComponent } from './adm-package-delete/adm-package-delete.component';
import { AdmDeleteListComponent } from './adm-delete-list/adm-delete-list.component';
import { BusinessNavigationComponent } from './business-navigation/business-navigation.component';
import { AdmCashOutComponent } from './adm-cash-out/adm-cash-out.component';
import { BusinessCashInComponent } from './business-cash-in/business-cash-in.component';
import { AdmCashOutHistoryComponent } from './adm-cash-out-history/adm-cash-out-history.component';
import { AdmPlanComponent } from './adm-plan/adm-plan.component';
import { BusinessPlanComponent } from './business-plan/business-plan.component';
import { ShowLocationComponent } from './show-location/show-location.component';
import { CusScanHistoryComponent } from './cus-scan-history/cus-scan-history.component';
import { AdmFeedbackListComponent } from './adm-feedback-list/adm-feedback-list.component';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CusHomeComponent,
    CusAboutComponent,
    CusCartComponent,
    CusHistoryComponent,
    CusBusinessComponent,
    CusPaymentComponent,
    NotFoundComponent,
    AdmHomeComponent,
    AdmBusinessComponent,
    AdmPackageComponent,
    AdmUserListComponent,
    CreateBusinessComponent,
    CreatePackagesComponent,
    AddBusinessCategoriesComponent,
    AddBusinessServicesComponent,
    CusEditComponent,
    AdmRegisterComponent,
    ServerDownpageComponent,
    UnauthorizedComponent,
    NavigationComponent,
    FooterComponent,
    MyCouponComponent,
    AdmSidebarComponent,
    CusExploreComponent,
    ScannerComponent,
    CusPackageComponent,
    EditBusinessComponent,
    EditPackagesComponent,
    AdmCategorylistComponent,
    AdmServicelistComponent,
    PaymentHistoryComponent,
    BusinessHomeComponent,
    ScanHistoryComponent,
    BusinessSaleComponent,
    BusinessAboutComponent,
    BusinessContactComponent,
    AdmCouponSalelistComponent,
    AdmFeedbackComponent,
    AdmBusinessDetailsComponent,
    CusProfileComponent,
    AdmProfileComponent,
    BusinessProfileComponent,
    CusCartPaymentComponent,
    OauthRedirectComponent,
    ContactComponent,
    PaymentMethodComponent,
    CusReceiveListComponent,
    CusTransferListComponent,
    BusinessRegisterComponent,
    BusinessPasswordResetComponent,
    AdmPaymentRequestComponent,
    OrderByConfirmPipe,
    CusExpiredCouponComponent,
    ForgetPasswordComponent,
    NotificationComponent,
    AdmBusinessDeleteComponent,
    AdmPackageDeleteComponent,
    AdmDeleteListComponent,
    BusinessNavigationComponent,
    BusinessNavigationComponent,
    AdmDeleteListComponent,
    AdmBusinessDeleteComponent,
    AdmPackageDeleteComponent,
    NotificationComponent,
    AdmCashOutComponent,
    BusinessCashInComponent,
    AdmCashOutHistoryComponent,
    AdmPlanComponent,
    BusinessPlanComponent,
    ShowLocationComponent,
    CusScanHistoryComponent,
    AdmFeedbackListComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxChartsModule,
    QrCodeModule,
    ToastrModule.forRoot({
      // Toastr configuration
      positionClass: 'toast-top-right',
      timeOut: 3000, // Duration for which the toast stays visible (in ms)
      preventDuplicates: true,
      progressBar: true, // Prevent duplicate toasts
      newestOnTop: true, // New toasts will appear at the top
      maxOpened: 3,
      closeButton: true, // Only show up to 3 toasts at a time
    }),
  ],
  providers: [
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],

  bootstrap: [AppComponent],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
