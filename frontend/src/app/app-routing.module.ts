import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataFormComponent } from './data-form/data-form.component';
import { HomeComponent } from './home/home.component';

import { TemplateComponent } from './template/template.component';

const routes: Routes = [
  { path: '', children: [
    {
      path: '', component: TemplateComponent, children: [
        { path: '', component: DashboardComponent },
        {
          path: 'form', component: DataFormComponent
        },
        { path: 'home', component: HomeComponent }
      ]
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
