import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusReceiveListComponent } from './cus-receive-list.component';

describe('CusReceiveListComponent', () => {
  let component: CusReceiveListComponent;
  let fixture: ComponentFixture<CusReceiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CusReceiveListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusReceiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
