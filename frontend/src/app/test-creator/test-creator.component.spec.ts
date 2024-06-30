import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCreatorComponent } from './test-creator.component';

describe('TestCreatorComponent', () => {
  let component: TestCreatorComponent;
  let fixture: ComponentFixture<TestCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
