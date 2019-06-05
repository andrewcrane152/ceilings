import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortendUnits',
  pure: false
})
export class ShortendUnitsPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value === 'inches' ? 'in' : 'cm';
  }
}
