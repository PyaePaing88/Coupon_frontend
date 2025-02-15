import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCashOutComponent } from './adm-cash-out.component';

describe('AdmCashOutComponent', () => {
  let component: AdmCashOutComponent;
  let fixture: ComponentFixture<AdmCashOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmCashOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmCashOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
