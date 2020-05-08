
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapContentfulModule } from 'cap-angular-contentful';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CapContentfulModule.forRoot({
      space: environment.space,
      accessToken: environment.accessToken,
      environment: environment.environment
    })
  ],
  exports: [
  ]
})
export class CapAngularContentfulModule {}
