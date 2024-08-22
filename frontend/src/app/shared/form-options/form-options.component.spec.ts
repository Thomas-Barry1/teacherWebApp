import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOptionsComponent } from './form-options.component';

describe('FormOptionsComponent', () => {
  let component: FormOptionsComponent;
  let fixture: ComponentFixture<FormOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
