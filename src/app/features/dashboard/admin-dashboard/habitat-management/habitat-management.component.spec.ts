import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitatManagementComponent } from './habitat-management.component';

describe('HabitatManagementComponent', () => {
  let component: HabitatManagementComponent;
  let fixture: ComponentFixture<HabitatManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitatManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
