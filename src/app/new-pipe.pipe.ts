import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderScore'})
export class OrderScore implements PipeTransform {
  transform(array: string, field): string {
    if (!Array.isArray(array)) {
        return;
      }
      array.sort((a: any, b: any) => {
        if (a[field] > b[field]) {
          return -1;
        } else if (a[field] < b[field]) {
          return 1;
        } else {
          return 0;
        }
      });
      return array;
  }
}