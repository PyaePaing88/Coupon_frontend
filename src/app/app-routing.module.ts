import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CusHomeComponent } from './cus-home/cus-home.component';
import { ServerDownpageComponent } from './server-downpage/server-downpage.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './shared/unauthorized/unauthorized.component';
import { CusAboutComponent } from './cus-about/cus-about.component';
import { ContactComponent } from './cus-contact/cus-contact.component';
import { CusHistoryComponent } from './cus-history/cus-history.component';
import { CusCartComponent } from './cus-cart/cus-cart.component';
import { MyCouponComponent } from './my-coupon/my-coupon.component';
import { AdmHomeComponent } from './adm-home/adm-home.component';
import { CusBusinessComponent } from './cus-business/cus-business.component';
import { CusExploreComponent } from './cus-explore/cus-explore.component';
import { ScannerComponent } from './scanner/scanner.component';
import { RegisterComponent } from './register/register.component';
import { CusPackageComponent } from './cus-package/cus-package.component';
import { AdmBusinessComponent } from './adm-business/adm-business.component';
import { AdmPackageComponent } from './adm-package/adm-package.component';
import { AdmUserListComponent } from './adm-user-list/adm-user-list.component';
import { CreateBusinessComponent } from './create/create-business/create-business.component';
import { AddBusinessCategoriesComponent } from './create/add-business-categories/add-business-categories.component';
import { AddBusinessServicesComponent } from './create/add-business-services/add-business-services.component';
import { CreatePackagesComponent } from './create/create-packages/create-packages.component';
import { EditBusinessComponent } from './edit/edit-business/edit-business.component';
import { EditPackagesComponent } from './edit/edit-packages/edit-packages.component';
import { AdmCategorylistComponent } from './adm-categorylist/adm-categorylist.component';
import { AdmServicelistComponent } from './adm-servicelist/adm-servicelist.component';
import { CusPaymentComponent } from './cus-payment/cus-payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { BusinessHomeComponent } from './business-home/business-home.component';
import { BusinessSaleComponent } from './business-sale/business-sale.component';
import { ScanHistoryComponent } from './scan-history/scan-history.component';
import { BusinessContactComponent } from './business-contact/business-contact.component';
import { BusinessAboutComponent } from './business-about/business-about.component';
import { AdmRegisterComponent } from './adm-register/adm-register.component';
import { loginGuard } from './core/guards/login.guard';
import { AdmCouponSalelistComponent } from './adm-coupon-salelist/adm-coupon-salelist.component';
import { AdmBusinessDetailsComponent } from './adm-business-details/adm-business-details.component';
import { CusProfileComponent } from './cus-profile/cus-profile.component';
import { AdmProfileComponent } from './adm-profile/adm-profile.component';
import { BusinessProfileComponent } from './business-profile/business-profile.component';
import { CusCartPaymentComponent } from './cus-cart-payment/cus-cart-payment.component';
import { OauthRedirectComponent } from './oauth-redirect/oauth-redirect.component';
import { AdmFeedbackComponent } from './adm-feedback/adm-feedback.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { CusTransferListComponent } from './cus-transfer-list/cus-transfer-list.component';
import { CusReceiveListComponent } from './cus-receive-list/cus-receive-list.component';
import { BusinessRegisterComponent } from './business-register/business-register.component';
import { BusinessPasswordResetComponent } from './business-password-reset/business-password-reset.component';
import { CusExpiredCouponComponent } from './cus-expired-coupon/cus-expired-coupon.component';
import { AdmPaymentRequestComponent } from './adm-payment-request/adm-payment-request.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NotificationComponent } from './notification/notification.component';
import { AdmBusinessDeleteComponent } from './adm-business-delete/adm-business-delete.component';
import { AdmPackageDeleteComponent } from './adm-package-delete/adm-package-delete.component';
import { AdmDeleteListComponent } from './adm-delete-list/adm-delete-list.component';
import { AdmCashOutComponent } from './adm-cash-out/adm-cash-out.component';
import { BusinessCashInComponent } from './business-cash-in/business-cash-in.component';
import { AdmCashOutHistoryComponent } from './adm-cash-out-history/adm-cash-out-history.component';
import { BusinessPlanComponent } from './business-plan/business-plan.component';
import { AdmPlanComponent } from './adm-plan/adm-plan.component';
import { ShowLocationComponent } from './show-location/show-location.component';
import { CusScanHistoryComponent } from './cus-scan-history/cus-scan-history.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent, canActivate: [loginGuard] },
  { path: 'home', component: CusHomeComponent },
  { path: 'explore', component: CusExploreComponent },
  { path: 'package', component: CusPackageComponent },
  { path: 'business/:id', component: CusBusinessComponent },
  { path: 'about', component: CusAboutComponent },
  { path: 'contact-us', component: ContactComponent },
  { path: 'history', component: CusHistoryComponent },
  {
    path: 'cart',
    component: CusCartComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'payment',
    component: CusPaymentComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'cart-payment',
    component: CusCartPaymentComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'my-coupon',
    component: MyCouponComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'cus-profile/:userId',
    component: CusProfileComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'transferlist',
    component: CusTransferListComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'receivelist',
    component: CusReceiveListComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'expiredlist',
    component: CusExpiredCouponComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'receivelist',
    component: CusReceiveListComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },
  {
    path: 'uselist',
    component: CusScanHistoryComponent,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
  },

  {
    path: 'adm-dashboard',
    component: AdmHomeComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-business-details/:id',
    component: AdmBusinessDetailsComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-dashboard',
    component: AdmHomeComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-business',
    component: AdmBusinessComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-categorylist',
    component: AdmCategorylistComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-servicelist',
    component: AdmServicelistComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-package',
    component: AdmPackageComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-user-list',
    component: AdmUserListComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-register',
    component: AdmRegisterComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'business-register',
    component: BusinessRegisterComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-coupon',
    component: AdmCouponSalelistComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'adm-feedback',
    component: AdmFeedbackComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'adm-delete-list',
    component: AdmDeleteListComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'adm-profile/:userId',
    component: AdmProfileComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'adm-business/Category/create',
    component: AddBusinessCategoriesComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'Service/create',
    component: AddBusinessServicesComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  { path: 'oauthCallback', component: OauthRedirectComponent },

  {
    path: 'request',
    component: AdmPaymentRequestComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'payment-method',
    component: PaymentMethodComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'cash-out',
    component: AdmCashOutComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'cash-out-history',
    component: AdmCashOutHistoryComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  {
    path: 'adm-plan',
    component: AdmPlanComponent,
    canActivate: [authGuard],
    data: { role: 'ADMIN' },
  },

  { path: 'forgetPassword', component: ForgetPasswordComponent },
  {
    path: 'password-reset',
    component: BusinessPasswordResetComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },

  {
    path: 'business-home',
    component: BusinessHomeComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },

  {
    path: 'Business/create',
    component: CreateBusinessComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'Business/edit/:id',
    component: EditBusinessComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'Package/create/:id',
    component: CreatePackagesComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'edit-package/:id',
    component: EditPackagesComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'business-sale/:businessId',
    component: BusinessSaleComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },

  {
    path: 'business-contact',
    component: BusinessContactComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'business-about',
    component: BusinessAboutComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'business-profile/:userId',
    component: BusinessProfileComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'scanner/:businessId',
    component: ScannerComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'scan-history/:businessId',
    component: ScanHistoryComponent,
    canActivate: [authGuard],
    data: { role: 'BUSINESS' },
  },
  {
    path: 'notification',
    component: NotificationComponent,
    canActivate: [authGuard],
    data: { role: ['BUSINESS', 'ADMIN', 'CUSTOMER'] },
  },
  {
    path: 'cash-in/:businessId',
    component: BusinessCashInComponent,
    canActivate: [authGuard],
    data: { role: ['BUSINESS', 'ADMIN', 'CUSTOMER'] },
  },

  {
    path: 'pricing/:businessId',
    component: BusinessPlanComponent,
    canActivate: [authGuard],
    data: { role: ['BUSINESS', 'ADMIN', 'CUSTOMER'] },
  },

  {
    path: 'location',
    component: ShowLocationComponent,
  },

  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: '404', component: NotFoundComponent },
  { path: 'serverIsDown', component: ServerDownpageComponent },
  { path: '401', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
