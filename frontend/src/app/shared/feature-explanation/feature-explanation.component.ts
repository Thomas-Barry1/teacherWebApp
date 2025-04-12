import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-feature-explanation',
  templateUrl: './feature-explanation.component.html',
  styleUrls: ['./feature-explanation.component.css']
})
export class FeatureExplanationComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() description: string = '';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Add loaded class after a small delay to ensure styles are applied
    setTimeout(() => {
      this.elementRef.nativeElement.querySelector('.feature-explanation').classList.add('loaded');
    }, 0);
  }
} 