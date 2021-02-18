import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoryViewerPage } from './story-viewer';
import { DirectivesModule } from '../directives/directives.module';

@NgModule({
  declarations: [StoryViewerPage],
  imports: [
    IonicModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    DirectivesModule,
    RouterModule.forChild([
      {
        path: '',
        component: StoryViewerPage,
      },
    ]),
  ],
})
export class StoryViewerPageModule {}
