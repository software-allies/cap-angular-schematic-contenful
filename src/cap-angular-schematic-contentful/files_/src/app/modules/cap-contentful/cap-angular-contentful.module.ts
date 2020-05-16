
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapContentfulModule } from 'cap-angular-contentful';
import { environment } from '../../../environments/environment';
import { MdtohtmlPipe } from './pipes/md-to-html.pipe';
import { StripTagsPipe } from './pipes/strip-tags.pipe';


@NgModule({
  declarations: [
    MdtohtmlPipe,
    StripTagsPipe
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
    MdtohtmlPipe,
    StripTagsPipe
  ]
})
export class CapAngularContentfulModule {}
