import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPasswordResetComponent } from './business-password-reset.component';

describe('BusinessPasswordResetComponent', () => {
  let component: BusinessPasswordResetComponent;
  let fixture: ComponentFixture<BusinessPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessPasswordResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
