import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LessonPlanGeneratorComponent } from './lesson-plan-generator/lesson-plan-generator.component';
import { QuizGeneratorComponent } from './quiz-generator/quiz-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    LessonPlanGeneratorComponent,
    QuizGeneratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
