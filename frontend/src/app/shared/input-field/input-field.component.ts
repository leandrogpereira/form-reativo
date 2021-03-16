import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACESSESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFieldComponent),
  multi: true
};

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [INPUT_FIELD_VALUE_ACESSESSOR]

})
export class InputFieldComponent implements ControlValueAccessor {

  @Input() classeCss: string;
  @Input() id: string;
  @Input() label: string;
  @Input() type = 'text';
  @Input() control;
  @Input() isReadyOnly = false;

  private innerValue: any;

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallBack(v);
    }
  }

  onChangeCallBack: (_: any) => void = () => {};
  onTouchedCallBack: (_: any) => void = () => {};

  writeValue(v: any): void {
    this.value = v;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallBack = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallBack = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadyOnly = isDisabled;
  }
}
