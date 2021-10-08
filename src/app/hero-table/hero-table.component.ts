import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';

import {
  FilterFormFieldTypes,
  FilterOperationEnums,
  GridColumnStyles,
  Table,
  TableState, ObjectStateService, TableEventListeners,
} from '@mosreg-spa/table';

import {DataService} from '../data.service';
import {TableEvent} from "@mosreg-spa/table/src/lib/models/table-event.interface";
import {GridEventCellClick} from "@mosreg-spa/table/src/lib/components/grid/models/grid-event-cell-click.interface";
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-table',
  templateUrl: './hero-table.component.html',
  styleUrls: ['./hero-table.component.css']
})

export class HeroTableComponent implements OnInit, OnDestroy {


  tableState: TableState = {};
  heroDetailId: string = "/heroes";
  tableEvents: EventEmitter<TableEvent>;

  gridCellClick(event: GridEventCellClick){
    this.heroDetailId = "/detail/" + (<Hero>event.row).heroId.toString()
  }

  tableEventListeners: TableEventListeners = {
    gridCellClick: this.gridCellClick.bind(this)
  }

  table: Table = {
    tableKey: 'example',
    tableName: 'Tour of Heroes',
    pagination: {
      pageSize: 7,
      pageSizes: [5,6,7,8,10]
    },
    export: true,
    gridColumns: [
      {
        key: 'heroId',
        header: 'Номер',
        expression: 'heroId',
        sortable: true,
        style:{
          type: GridColumnStyles.Text
        }
      },
      {
        key: 'heroName',
        header: 'Имя',
        expression: 'heroName',
        sortable: true,
        style:{
          type: GridColumnStyles.Link
        }
      },
    ],
    filterFormFields: [
      {
        key: 'filterIDEq',
        header: 'id = ',
        type: FilterFormFieldTypes.Number,
        field: 'heroIdEq',
        operation: FilterOperationEnums.EQ,
      },
      {
        key: 'filterIDNEq',
        header: 'id != ',
        type: FilterFormFieldTypes.Number,
        field: 'heroIdNEq',
        operation: FilterOperationEnums.NOT_EQ,
      },
      {
        key: 'filterIDGreat',
        header: 'id > ',
        type: FilterFormFieldTypes.Number,
        field: 'heroIdGreat',
        operation: FilterOperationEnums.GT,
      },
      {
        key: 'filterIDLess',
        header: 'id < ',
        type: FilterFormFieldTypes.Number,
        field: 'heroIdLess',
        operation: FilterOperationEnums.LT,
      },
      {
        key: 'filterName',
        header: 'Имя',
        type: FilterFormFieldTypes.String,
        field: 'heroName',
        operation: FilterOperationEnums.CONTAINS
      },
    ],
    defaultSort: {
      column: {key: 'bill_date', header: 'bill_date'},
      direction: 'asc'
    }
  };

  constructor(
    public dataService: DataService,
    private objectStateService: ObjectStateService
  ) {
    this.tableEvents = new EventEmitter();
  }

  ngOnInit(): void {

    this.dataService.listAll(undefined, undefined, undefined);
    this.tableState = this.objectStateService.get('list-of-heroes') || {};
  }

  ngOnDestroy() {
    this.objectStateService.set('list-of-heroes', this.tableState)
  }


}
