import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsVeterinaireDashboardComponent } from './reports-veterinary-management.component';

describe('ReportsVeterinaireDashboardComponent', () => {
  let component: ReportsVeterinaireDashboardComponent;
  let fixture: ComponentFixture<ReportsVeterinaireDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsVeterinaireDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsVeterinaireDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
