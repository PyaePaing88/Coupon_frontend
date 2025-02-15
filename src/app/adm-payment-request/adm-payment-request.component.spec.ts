import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPaymentRequestComponent } from './adm-payment-request.component';

describe('AdmPaymentRequestComponent', () => {
  let component: AdmPaymentRequestComponent;
  let fixture: ComponentFixture<AdmPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmPaymentRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
