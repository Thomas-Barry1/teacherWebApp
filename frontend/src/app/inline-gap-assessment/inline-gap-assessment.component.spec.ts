import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineGapAssessmentComponent } from './inline-gap-assessment.component';

describe('InlineGapAssessmentComponent', () => {
  let component: InlineGapAssessmentComponent;
  let fixture: ComponentFixture<InlineGapAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineGapAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InlineGapAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
