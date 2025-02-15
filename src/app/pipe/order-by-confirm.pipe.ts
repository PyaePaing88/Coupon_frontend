import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByConfirm',
})
export class OrderByConfirmPipe implements PipeTransform {
  transform(purchases: any[]): any[] {
    if (!purchases) return [];
    return purchases.sort((a, b) => {
      // Sort confirmed rows to the top
      return (b.confirm === true ? 1 : 0) - (a.confirm === true ? 1 : 0);
    });
  }
}
