import { StoryViewerPage } from './../story-viewer/story-viewer';
import { ModalController } from '@ionic/angular';
import { StoryUser } from './../shared/models/story-user.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  stories: StoryUser[] = [
    {
      userPicture: 'assets/img/avatars/1.jpg',
      userId: 1,
      userName: 'Maria',
      currentItem: 0,
      items: [
        {
          date: 'há 20 minutos',
          duration: '5',
          id: '3',
          media: 'assets/img/img_1.png',
          seen: true,
          type: 0,
          views: 5,
        },
      ],
      seen: true,
    },
    {
      userPicture: 'assets/img/avatars/1.jpg',
      userId: 2,
      userName: 'Flávio',
      currentItem: 0,
      seen: false,
      items: [
        {
          date: 'há 30 minutos',
          duration: '4',
          id: '64',
          media: 'assets/img/img_2.png',
          seen: false,
          type: 0,
          views: null,
        },
        {
          date: 'há 30 minutos',
          duration: '3',
          id: '74',
          media: 'assets/img/img_3.png',
          seen: false,
          type: 0,
          views: null,
        },
        {
          date: 'há 1 hora',
          duration: null,
          id: '84',
          media: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          seen: false,
          type: 1,
          views: null,
        },
      ],
    },
    {
      userPicture: 'assets/img/avatars/1.jpg',
      userId: 3,
      userName: 'Anna',
      currentItem: 0,
      items: [
        {
          date: 'há 20 minutos',
          duration: '5',
          id: '3',
          media: 'assets/img/img_2.png',
          seen: true,
          type: 0,
          views: 5,
        },
      ],
      seen: true,
    },
    {
      userPicture: 'assets/img/avatars/1.jpg',
      userId: 4,
      userName: 'Oscar',
      currentItem: 0,
      seen: false,
      items: [
        {
          date: 'há 30 minutos',
          duration: '4',
          id: '64',
          media: 'assets/img/img_2.png',
          seen: false,
          type: 0,
          views: null,
        },
        {
          date: 'há 30 minutos',
          duration: '3',
          id: '74',
          media: 'assets/img/img_3.png',
          seen: false,
          type: 0,
          views: null,
        },
        {
          date: 'há 1 hora',
          duration: null,
          id: '84',
          media: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          seen: false,
          type: 1,
          views: null,
        },
      ],
    },
    {
      userPicture: 'assets/img/avatars/1.jpg',
      userId: 5,
      userName: 'Nicole',
      currentItem: 0,
      items: [
        {
          date: 'há 20 minutos',
          duration: '5',
          id: '3',
          media: 'assets/img/img_2.png',
          seen: true,
          type: 0,
          views: 5,
        },
      ],
      seen: true,
    },
    {
      userPicture: 'assets/img/avatars/1.jpg',
      userId: 6,
      userName: 'Mario',
      currentItem: 0,
      seen: false,
      items: [
        {
          date: 'há 30 minutos',
          duration: '4',
          id: '64',
          media: 'assets/img/img_2.png',
          seen: false,
          type: 0,
          views: null,
        },
        {
          date: 'há 30 minutos',
          duration: '3',
          id: '74',
          media: 'assets/img/img_3.png',
          seen: false,
          type: 0,
          views: null,
        },
        {
          date: 'há 1 hora',
          duration: null,
          id: '84',
          media: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
          seen: false,
          type: 1,
          views: null,
        },
      ],
    },
  ];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.reorderStories();
  }

  async openStoryViewer(index: number) {
    let modal = await this.modalCtrl.create({
      component: StoryViewerPage,
      componentProps: { stories: this.stories, tapped: index },
    });

    modal.onDidDismiss().then(() => {
      this.reorderStories();
    });
    modal.present();
  }

  reorderStories() {
    this.stories.sort((a, b) => {
      if (a.seen) return 1;
      if (b.seen) return -1;

      return 0;
    });
  }
}
