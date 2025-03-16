import { provideHttpClient } from '@angular/common/http';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ButtonComponent } from 'app/shared/components/button/button.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { RateComponent } from '../../../../shared/components/rate/rate.component';
import { ToastService } from '../../../../shared/components/toast/services/toast.service';
import { UserOpinionsService } from '../services/user-opinions.service';
import { AddUserOpinionsComponent } from './add-user-opinions.component';

describe('AddUserOpinionsComponent', () => {
  let component: AddUserOpinionsComponent;
  let fixture: ComponentFixture<AddUserOpinionsComponent>;
  let userOpinionsService: jasmine.SpyObj<UserOpinionsService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(async () => {
    // Configuration des mocks pour les services
    const userOpinionsSpy = jasmine.createSpyObj('UserOpinionsService', [
      'addUserOpinions',
    ]);

    const toastSubject = new BehaviorSubject({
      message: '',
      type: 'success',
      duration: 3000,
    });
    const toastSpy = jasmine.createSpyObj(
      'ToastService',
      ['showSuccess', 'showError', 'showWarning', 'showConfirm'],
      { toast$: toastSubject.asObservable() }
    );

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AddUserOpinionsComponent,
        RateComponent,
        ButtonComponent,
      ],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideAnimations(),
        { provide: UserOpinionsService, useValue: userOpinionsSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    userOpinionsService = TestBed.inject(
      UserOpinionsService
    ) as jasmine.SpyObj<UserOpinionsService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    // Spy sur console.error pour éviter l'affichage dans les logs
    consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
  });

  afterEach(() => {
    // Restaurer console.error après les tests
    consoleErrorSpy.and.callThrough();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserOpinionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.opinionForm.get('name')?.value).toBe('');
    expect(component.opinionForm.get('message')?.value).toBe('');
    expect(component.opinionForm.get('rating')?.value).toBe(0);
    expect(component.opinionForm.get('date')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.opinionForm;
    expect(form.valid).toBeFalsy();

    form.controls['name'].setValue('John');
    form.controls['message'].setValue('Great experience');
    form.controls['rating'].setValue(5);
    form.controls['date'].setValue('2024-03-20');

    expect(form.valid).toBeTruthy();
  });

  it('should validate name format', () => {
    const nameControl = component.opinionForm.controls['name'];

    nameControl.setValue('J');
    expect(nameControl.errors?.['minlength']).toBeTruthy();

    nameControl.setValue('John123');
    expect(nameControl.errors?.['pattern']).toBeTruthy();

    nameControl.setValue('John Doe');
    expect(nameControl.errors).toBeNull();
  });

  it('should emit close event when onClose is called', () => {
    spyOn(component.closeModal, 'emit');
    component.onClose();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should submit form successfully', fakeAsync(() => {
    const mockOpinion = {
      name: 'John Doe',
      message: 'Great experience here',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
    };

    userOpinionsService.addUserOpinions.and.returnValue(
      of({
        name: 'John Doe',
        message: 'Great experience',
        rating: 5,
        date: new Date('2024-03-20'),
        validated: false,
        rejected: false,
        status: 'pending',
      })
    );
    spyOn(component.opinionAdded, 'emit');
    spyOn(component.closeModal, 'emit');

    component.opinionForm.patchValue(mockOpinion);
    component.onSubmit();

    tick();

    expect(userOpinionsService.addUserOpinions).toHaveBeenCalled();
    expect(toastService.showSuccess).toHaveBeenCalled();
    expect(component.opinionAdded.emit).toHaveBeenCalled();

    tick(2500);
    expect(component.closeModal.emit).toHaveBeenCalled();
  }));

  it('should handle submission error', fakeAsync(() => {
    const mockOpinion = {
      name: 'John Doe',
      message: 'Great experience here',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
    };

    userOpinionsService.addUserOpinions.and.returnValue(
      throwError(() => new Error("Test d'erreur simulée"))
    );

    component.opinionForm.patchValue(mockOpinion);
    component.onSubmit();

    tick();

    expect(toastService.showError).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erreur lors de l'envoi de l'avis",
      jasmine.any(Error)
    );
  }));
});
