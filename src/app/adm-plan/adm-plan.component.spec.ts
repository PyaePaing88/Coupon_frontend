import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPlanComponent } from './adm-plan.component';

describe('AdmPlanComponent', () => {
  let component: AdmPlanComponent;
  let fixture: ComponentFixture<AdmPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
