import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ChildhoodProfile } from "@becoming-german/model";

export type FormGroupMap<T> = FormGroup<{
  [Property in keyof T]: T[Property] extends (infer U)[] ? FormArray<FormGroupMap<U>> : FormControl<T[Property]>;
}>;

@Component({
  selector: 'bgn-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {
  form: FormGroupMap<ChildhoodProfile> = this.fb.nonNullable.group({

  });

  constructor(private fb: FormBuilder) {}
}
