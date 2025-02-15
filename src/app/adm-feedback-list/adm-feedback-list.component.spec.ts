import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmFeedbackListComponent } from './adm-feedback-list.component';

describe('AdmFeedbackListComponent', () => {
  let component: AdmFeedbackListComponent;
  let fixture: ComponentFixture<AdmFeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmFeedbackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
