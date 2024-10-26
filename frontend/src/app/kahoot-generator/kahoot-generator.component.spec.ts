import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootGeneratorComponent } from './kahoot-generator.component';

describe('KahootGeneratorComponent', () => {
  let component: KahootGeneratorComponent;
  let fixture: ComponentFixture<KahootGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KahootGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KahootGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
