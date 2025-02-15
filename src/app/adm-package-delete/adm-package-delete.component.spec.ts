import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmPackageDeleteComponent } from './adm-package-delete.component';

describe('AdmPackageDeleteComponent', () => {
  let component: AdmPackageDeleteComponent;
  let fixture: ComponentFixture<AdmPackageDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmPackageDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmPackageDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
