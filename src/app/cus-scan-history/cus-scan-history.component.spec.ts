import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusScanHistoryComponent } from './cus-scan-history.component';

describe('CusScanHistoryComponent', () => {
  let component: CusScanHistoryComponent;
  let fixture: ComponentFixture<CusScanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CusScanHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusScanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
