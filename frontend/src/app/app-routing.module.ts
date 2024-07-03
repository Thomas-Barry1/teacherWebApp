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

//TODO: Allow lazy loading in future
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
// import { TestCreatorComponent } from './test-creator/test-creator.component';

// // Define the application routes
// const routes: Routes = [
//   {
//     path: 'lesson-plan',
//     loadChildren: () => import('./lesson-plan/lesson-plan.module').then(m => m.LessonPlanModule)
//   },
//   {
//     path: 'test-creator',
//     loadChildren: () => import('./test-creator/test-creator.module').then(m => m.TestCreatorModule)
//   },
//   { path: '', redirectTo: '/lesson-plan', pathMatch: 'full' } // Default route
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
