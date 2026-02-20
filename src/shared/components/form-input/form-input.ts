import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [NgClass,ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css'
})
export class FormInput {

  @Input() label!: any;
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() control!: FormControl;


}
