import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpinionManagementComponent } from './user-opinion-management.component';

describe('UserOpinionManagementComponent', () => {
  let component: UserOpinionManagementComponent;
  let fixture: ComponentFixture<UserOpinionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOpinionManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOpinionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
