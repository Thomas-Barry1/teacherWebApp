import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveTestComponent } from './active-test.component';

describe('ActiveTestComponent', () => {
  let component: ActiveTestComponent;
  let fixture: ComponentFixture<ActiveTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
