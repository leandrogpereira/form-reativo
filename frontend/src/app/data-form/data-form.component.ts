import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { empty, Observable } from 'rxjs';
import { distinct, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Cidade } from '../models/cidade';
import { EstadoBr } from '../models/estado-br';
import { ApiService } from '../services/api.service';
import { ConsultaCepService } from '../services/consulta-cep.service';
import { DropdownService } from '../services/dropdown.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';
import { FormValidations } from '../shared/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  // form: FormGroup;
  // estados: Observable<EstadoBr[]>;
  estados: EstadoBr[];
  cidades: Cidade[];
  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super();
  }

  ngOnInit() {
    // this.dropdownService.getEstadosBr().subscribe((estados: EstadoBr[]) => this.estados = estados);
    // this.estados = this.dropdownService.getEstadosBr();
    this.dropdownService.getEstadosBr()
      .subscribe(dados => this.estados = dados);
    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsLetter();
    // this.verificaEmailService.verificarEmail('').subscribe();


    // this.apiService.get('/cadastros', 2).subscribe(cadastro => {
    //   console.log(cadastro);
    // })
    // this.form = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // });

    this.form = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidador]],
        numero: [null , Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null,  Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });

    this.form.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      switchMap(status => status === 'VALID' ?
        this.cepService.consultaCEP(this.form.get('endereco.cep').value)
        : []
        )
      )
    .subscribe(dados => dados ? this.populaDadosForm(dados) : {});

    this.form.get('endereco.estado').valueChanges
      .pipe(
        tap(estado => console.log('Novo estado: ', estado)),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].id : empty()),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
      )
      .subscribe(cidades => this.cidades = cidades);

  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(v));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));
  }

  submit() {
    let valueSubmit = Object.assign({}, this.form.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v, i) => v ? this.frameworks[i] : null)
      .filter(v => v && v !== null)
    });

    this.apiService.post('/cadastros', this.form.value).subscribe(cadastro => {
      alert('Registro cadastrado com sucesso.');
    }, (error: any) => alert(`Erro ao gravar cadastro. Erro: ${error}`));

    this.form.reset();
  }

  consultaCEP() {
    // Nova variável "cep" somente com dígitos.
    var cep = this.form.get('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => {
          this.populaDadosForm(dados)
        });;
    }
  }

  populaDadosForm(dados) {
    /*formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });*/

    this.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  validarEmail(formControl: FormControl) {
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true} : null));
  }

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.form.get('cargo').setValue(cargo);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  setarTecnologias() {
    this.form.get('tecnologias').setValue(['java', 'javascript', 'php']);
  }


  voltar() {
    this.router.navigate(['/']);
  }



}
