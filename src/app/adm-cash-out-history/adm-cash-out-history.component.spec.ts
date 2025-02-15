import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCashOutHistoryComponent } from './adm-cash-out-history.component';

describe('AdmCashOutHistoryComponent', () => {
  let component: AdmCashOutHistoryComponent;
  let fixture: ComponentFixture<AdmCashOutHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmCashOutHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmCashOutHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
