import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZooIntroComponent } from './zoo-intro.component';

describe('ZooIntroComponent', () => {
  let component: ZooIntroComponent;
  let fixture: ComponentFixture<ZooIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZooIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZooIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
