import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingDataComponent } from './animal-feeding-management.component';

describe('FeedingDataComponent', () => {
  let component: FeedingDataComponent;
  let fixture: ComponentFixture<FeedingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedingDataComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
