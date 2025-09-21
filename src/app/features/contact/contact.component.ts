import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactService } from './service/contact.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class ContactComponent {
  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      this.contactService.sendContactEmail(this.contactForm.value).subscribe({
        next: () => {
          this.notificationService.show(
            'Message envoyé avec succès !',
            'success'
          );
          this.contactForm.reset();
        },
        error: () => {
          this.notificationService.show(
            "Une erreur s'est produite lors de l'envoi du message",
            'error'
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
