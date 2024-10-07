import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsOverviewComponent } from './animals-overview.component';

describe('AnimalsOverviewComponent', () => {
  let component: AnimalsOverviewComponent;
  let fixture: ComponentFixture<AnimalsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
