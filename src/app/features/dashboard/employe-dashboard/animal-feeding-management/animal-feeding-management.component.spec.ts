import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalFeedingManagementComponent } from './animal-feeding-management.component';

describe('AnimalFeedingManagementComponent', () => {
  let component: AnimalFeedingManagementComponent;
  let fixture: ComponentFixture<AnimalFeedingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalFeedingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalFeedingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
