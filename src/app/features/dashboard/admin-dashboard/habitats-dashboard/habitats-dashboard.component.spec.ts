import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitatsDashboardComponent } from './habitats-dashboard.component';

describe('HabitatsDashboardComponent', () => {
  let component: HabitatsDashboardComponent;
  let fixture: ComponentFixture<HabitatsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitatsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitatsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
