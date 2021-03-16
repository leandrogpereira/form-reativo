import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  template: '<div></div>'
})
export abstract class BaseFormComponent implements OnInit {

  form: FormGroup;

  constructor() { }

  ngOnInit(): void {

  }

  abstract submit();

  onSubmit() {
    if (this.form.valid) {
      this.submit();
    } else {
      this.verificaValidadosForm(this.form);
    }
  }

  verificaValidadosForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      controle.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidadosForm(controle);
      }
    });
  }

  resetaDadosForm() {
    this.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  validaForm(campo: string) {
    return {'is-invalid': this.verificaToque(campo)};
  }

  verificaToque(campo: string) {
    return (
      !this.form.get(campo).valid &&
      (this.form.get(campo).touched || this.form.get(campo).dirty)
    );
  }

  verificaRequired(campo: string) {
    return (
      this.form.get(campo).hasError('required') &&
      (this.form.get(campo).touched || this.form.get(campo).dirty)
    );
  }

  verificaEmail() {
    let campoEmail = this.form.get('email');
    if (campoEmail.errors) {
      return campoEmail.touched && !campoEmail.errors['email'];
    }
  }
}
