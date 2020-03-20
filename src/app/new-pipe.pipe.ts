import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderScore'})
export class OrderScore implements PipeTransform {
  transform(array: string, fields){
    var field = fields.score;
    if (!Array.isArray(array)) {
        return;
      }
      var goodArr = [];
      array.filter((val)=>{
        if(val.time == fields.time){
          goodArr.push(val);
        }
      })
      goodArr.sort((a: any, b: any) => {
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
      return goodArr;
  }
}