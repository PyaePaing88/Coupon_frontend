import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmBusinessDeleteComponent } from './adm-business-delete.component';

describe('AdmBusinessDeleteComponent', () => {
  let component: AdmBusinessDeleteComponent;
  let fixture: ComponentFixture<AdmBusinessDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmBusinessDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmBusinessDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
