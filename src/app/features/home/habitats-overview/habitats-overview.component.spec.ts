import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitatsOverviewComponent } from './habitats-overview.component';

describe('HabitatsOverviewComponent', () => {
  let component: HabitatsOverviewComponent;
  let fixture: ComponentFixture<HabitatsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitatsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitatsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
