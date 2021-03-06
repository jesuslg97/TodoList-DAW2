import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { ActivityServiceService } from '../services/activity-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  form: FormGroup;

  constructor(private as: ActivityServiceService) {
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(15)
      ]),
      description: new FormControl(),
      priority: new FormControl(),
      status: new FormControl(),
      date: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  onValidate(){
    if (this.form.valid){
      this.form.value.status = 0;
      this.form.value.date = Date.now();
      this.as.addActivity(this.form.value);
      this.form.reset();
    }
  }

}
