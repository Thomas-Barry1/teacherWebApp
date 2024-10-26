import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { TestCreatorComponent } from './test-creator/test-creator.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { ActivitiesComponent } from './activities/activities.component';
import { LoginComponent } from './login/login.component';
// Auth guard protects routes with authentication
import { AuthGuard } from './auth.guard';
import { KahootGeneratorComponent } from './kahoot-generator/kahoot-generator.component';

const routes: Routes = [
  { path: 'lesson-plan', component: LessonPlanComponent, canActivate: [AuthGuard] },
  { path: 'test-creator', component: TestCreatorComponent, canActivate: [AuthGuard] },
  { path: 'kahoot', component: KahootGeneratorComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
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
