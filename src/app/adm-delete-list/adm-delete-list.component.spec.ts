import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmDeleteListComponent } from './adm-delete-list.component';

describe('AdmDeleteListComponent', () => {
  let component: AdmDeleteListComponent;
  let fixture: ComponentFixture<AdmDeleteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmDeleteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmDeleteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
