import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(arrObj :any[], searchTerm :string): any[] {
    return arrObj.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

}
