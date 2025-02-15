import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusTransferListComponent } from './cus-transfer-list.component';

describe('CusTransferListComponent', () => {
  let component: CusTransferListComponent;
  let fixture: ComponentFixture<CusTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CusTransferListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
