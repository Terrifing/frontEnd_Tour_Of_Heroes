import { Hero } from './hero';

import {ClientDataSourceService, DataSourceListResponse, Filters, Orders, Pagination} from '@mosreg-spa/table'
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HeroService} from "./hero.service";
import {map} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class DataService extends ClientDataSourceService<Hero> {

  constructor(
    private heroService: HeroService,
  ) {
    super()
  }

  checkPage(pagination: Pagination){
    return isNaN(<number>pagination?.page_index)
  }

  filterList(data: Hero[], filters: Filters): Hero[]{
    for (const filter in filters) {
      if((filters[filter].field == "heroIdEq")&&(filters[filter].operation == 'equals'))
        data = data.filter(function idEqual(element, index, array) { return (element.heroId == filters[filter].value); })
      if((filters[filter].field == "heroIdNEq")&&(filters[filter].operation == 'ne'))
        data = data.filter(function idNotEqual(element, index, array) { return (element.heroId != filters[filter].value); })
      if((filters[filter].field == "heroIdGreat")&&(filters[filter].operation == 'gt'))
        data = data.filter(function idNotEqual(element, index, array) { return (element.heroId > filters[filter].value); })
      if((filters[filter].field == "heroIdLess")&&(filters[filter].operation == 'lt'))
        data = data.filter(function idNotEqual(element, index, array) { return (element.heroId < filters[filter].value); })
      if ((filters[filter].field == "heroName")&&(filters[filter].operation == 'contains'))
        data = data.filter(function nameLike(element, index, array) { return (element.heroName.indexOf(<string>filters[filter].value) != -1); })
    }
    return data;
  }

  listAll(filters: Filters | undefined, orders: Orders | undefined, pagination: Pagination | undefined): Observable<DataSourceListResponse<Hero>> {
    return this.heroService.getHeroes().pipe(map(l => {

      if((pagination)&&(this.checkPage(pagination)))
          pagination.page_index = 1

      if(filters)
        l = this.filterList(l, filters)

      return {data: l, totalItems: l.length, orders: orders, filters: filters, pagination: pagination}
    }));
  }

}
