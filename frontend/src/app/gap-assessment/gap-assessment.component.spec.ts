import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapAssessmentComponent } from './gap-assessment.component';

describe('GapAssessmentComponent', () => {
  let component: GapAssessmentComponent;
  let fixture: ComponentFixture<GapAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GapAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GapAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
