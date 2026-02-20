import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../core/model/product';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(arr: Product[], searchText: string): any[] {
    if (!searchText) {
      return arr;
    }
    return arr.filter(item => {
      return item.title.toLowerCase().includes(searchText.toLowerCase());
    });
  }

}
