import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  readonly isSubmitted = signal<boolean>(false);

  formData = {
    name: '',
    email: '',
    subject: 'Renseignement général',
    message: '',
  };

  onSubmit(): void {
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.isSubmitted.set(true);
    }
  }
}
