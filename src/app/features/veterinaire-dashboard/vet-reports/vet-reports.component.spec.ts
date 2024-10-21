import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetReportsComponent } from './vet-reports.component';

describe('VetReportsComponent', () => {
  let component: VetReportsComponent;
  let fixture: ComponentFixture<VetReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VetReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VetReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
