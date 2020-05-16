import { Pipe, PipeTransform } from '@angular/core';
import * as marked from 'marked';

@Pipe({
  name: 'mdToHtml'
})
export class MdtohtmlPipe implements PipeTransform {
  transform(value: string): any {
    return marked(value);
  }
}