import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  data: any;
  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.carregarRegistros();
  }

  alterarCadastro(data) {
    return ;
  }

  removerCadastro(data) {
    this.data = null;
    setTimeout(() =>  {
      this.apiService.delete('/cadastros', data.id).subscribe(cadastro => {
        console.log('Removeu!');
        this.carregarRegistros();
      });
    }, 5000);
  }

  carregarRegistros() {
    this.apiService.get('/cadastros').subscribe(cadastro => {
      this.data = cadastro;
    });
  }
}
