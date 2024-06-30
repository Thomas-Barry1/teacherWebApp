import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { TestCreatorComponent } from './test-creator/test-creator.component';

const routes: Routes = [
  { path: 'lesson-plan', component: LessonPlanComponent },
  { path: 'test-creator', component: TestCreatorComponent },
  { path: '', redirectTo: '/lesson-plan', pathMatch: 'full' } // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
