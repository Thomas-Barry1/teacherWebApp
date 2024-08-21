import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOption } from '@angular/material/core';

import { AppComponent } from './app.component';
import { LessonPlanComponent } from './lesson-plan/lesson-plan.component';
import { TestCreatorComponent } from './test-creator/test-creator.component';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ActivitiesComponent } from './activities/activities.component';
import { PrintButtonComponent } from './shared/print-button/print-button.component';

@NgModule({ declarations: [
        AppComponent,
        LessonPlanComponent,
        TestCreatorComponent,
        HomeComponent,
        HomePageComponent,
        AboutComponent,
        ActivitiesComponent,
        PrintButtonComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDividerModule,
        MatToolbarModule,
        MatIconModule,
        MatGridListModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatOption,
        MatListModule], providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()] })
export class AppModule { }
