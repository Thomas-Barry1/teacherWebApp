import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonPlanGeneratorComponent } from './lesson-plan-generator.component';

describe('LessonPlanGeneratorComponent', () => {
  let component: LessonPlanGeneratorComponent;
  let fixture: ComponentFixture<LessonPlanGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonPlanGeneratorComponent]
    });
    fixture = TestBed.createComponent(LessonPlanGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
