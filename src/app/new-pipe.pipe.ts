import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderScore'})
export class OrderScore implements PipeTransform {
  transform(array: string, field): string {
    if (!Array.isArray(array)) {
        return;
      }
      array.sort((a: any, b: any) => {
        var goodA = parseInt(a[field]);
        var goodB = parseInt(b[field]);
        if (goodA > goodB) {
          return -1;
        } else if (goodA < goodB) {
          return 1;
        } else {
          return 0;
        }
      });
      return array;
  }
}