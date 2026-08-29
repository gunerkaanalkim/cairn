import { Component, ChangeDetectionStrategy, input, contentChildren, contentChild, TemplateRef } from '@angular/core';
import { NgTemplateOutlet, NgClass } from '@angular/common';
import type { TableApi, ColumnDef, Row } from '@gunerkaanalkim/cairn-datatable/core';
import { DEFAULT_EMPTY_MESSAGE } from '@gunerkaanalkim/cairn-datatable/core';
import { CairnCell, CellContext } from './directives/cell-template';
import { CairnHeader } from './directives/header-template';
import { CairnEmpty } from './directives/empty-template';
import { CairnLoading } from './directives/loading-template';
import { CairnClassNames } from './class-names';

@Component({
  selector: 'cairn-data-table',
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgTemplateOutlet, NgClass],
  host: {
    '[class]': 'classNames().root || ""',
    'class': 'cairn-root'
  }
})
export class DataTable<T> {
  readonly table = input.required<TableApi<T>>();
  readonly classNames = input<CairnClassNames>({});
  readonly caption = input<string>('');
  readonly loading = input<boolean>(false);
  readonly emptyMessage = input<string>(DEFAULT_EMPTY_MESSAGE);
  readonly selectable = input<boolean>(false);

  protected readonly cellTemplates = contentChildren(CairnCell);
  protected readonly headerTemplates = contentChildren(CairnHeader);
  protected readonly emptyTemplate = contentChild(CairnEmpty);
  protected readonly loadingTemplate = contentChild(CairnLoading);

  protected get columnSpan(): number {
    return this.table().visibleColumns().length + (this.selectable() ? 1 : 0);
  }

  protected headerTemplateFor(columnId: string): TemplateRef<{ $implicit: ColumnDef<T> }> | null {
    const tpls = this.headerTemplates();
    const specific = tpls.find(t => t.cairnHeader() === columnId);
    if (specific) return specific.templateRef;
    const generic = tpls.find(t => !t.cairnHeader());
    return generic ? generic.templateRef : null;
  }

  protected cellTemplateFor(columnId: string): TemplateRef<CellContext<T>> | null {
    const tpls = this.cellTemplates();
    const specific = tpls.find(t => t.cairnCell() === columnId);
    if (specific) return specific.templateRef;
    const generic = tpls.find(t => !t.cairnCell());
    return generic ? generic.templateRef : null;
  }

  protected cellContext(row: Row<T>, column: ColumnDef<T>): CellContext<T> {
    return {
      $implicit: this.table().cellValue(row, column.id),
      row: row.data,
      columnId: column.id
    };
  }

  protected ariaSort(column: ColumnDef<T>): string {
    if (column.sortable === false) return 'none';
    const sort = this.table().sorting().find(s => s.id === column.id);
    if (!sort) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected onHeaderKeydown(event: KeyboardEvent, column: ColumnDef<T>): void {
    if (column.sortable === false) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.table().toggleSort(column.id, event.shiftKey);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.table().clearSorting();
    }
  }
}
