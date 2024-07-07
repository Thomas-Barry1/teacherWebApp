import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { TestCreatorComponent } from './test-creator/test-creator.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { ActivitiesComponent } from './activities/activities.component';

const routes: Routes = [
  { path: 'lesson-plan', component: LessonPlanComponent },
  { path: 'test-creator', component: TestCreatorComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' } // Default route
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
