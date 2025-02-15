import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusExpiredCouponComponent } from './cus-expired-coupon.component';

describe('CusExpiredCouponComponent', () => {
  let component: CusExpiredCouponComponent;
  let fixture: ComponentFixture<CusExpiredCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CusExpiredCouponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusExpiredCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
