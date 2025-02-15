import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCashInComponent } from './business-cash-in.component';

describe('BusinessCashInComponent', () => {
  let component: BusinessCashInComponent;
  let fixture: ComponentFixture<BusinessCashInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessCashInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCashInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
