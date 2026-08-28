import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CairnDatatable } from './cairn-datatable';

describe('CairnDatatable', () => {
  let component: CairnDatatable;
  let fixture: ComponentFixture<CairnDatatable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CairnDatatable],
    }).compileComponents();

    fixture = TestBed.createComponent(CairnDatatable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
