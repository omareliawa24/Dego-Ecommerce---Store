import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText'
})
export class ShortTextPipe implements PipeTransform {

  transform(value:string , limit:number = 40): string {
    if (!value) return '';
    return value.length > limit
      ? value.substring(0, limit) + '...'
      : value;
  }

}
