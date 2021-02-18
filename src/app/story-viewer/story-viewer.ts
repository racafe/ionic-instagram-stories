import { cubeEffectSlideOpts } from './cubeEffectSlideOpts';
import { StoryUser } from './../shared/models/story-user.interface';
import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { Platform, IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-story-viewer',
  templateUrl: 'story-viewer.html',
  styleUrls: ['story-viewer.scss'],
})
export class StoryViewerPage implements OnInit {
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @ViewChild('progress', { static: false }) set progressElement(progress: any) {
    if (progress) {
      progress = progress.nativeElement;

      progress.addEventListener('animationend', () => {
        this.nextStoryItem();
      });
      progress.addEventListener('webkitAnimationEnd', () => {
        this.nextStoryItem();
      });
    }
  }
  @ViewChild('video') set videoElement(video: ElementRef) {
    if (video) {
      this.video = video.nativeElement;
      this.video.onwaiting = () => {
        this.isWaiting = true;
      };
      this.video.onready = this.video.onload = this.video.onplaying = this.video.oncanplay = () => {
        this.isWaiting = false;
      };

      this.video.addEventListener('loadedmetadata', () => {
        let storyVideo = this.getCurrentStoryItem();
        console.log('Event listener added ', storyVideo.media);
        if (this.video.duration && !storyVideo.duration) storyVideo.duration = this.video.duration;

        this.video.play();
      });
    } else {
      if (this.video) this.video = null;
    }
  }
  @Input() stories: StoryUser[];
  @Input() tapped: number;
  userId: number = 1; // Get user from Authenticated User Service
  isPaused: boolean = false;
  video: any;
  isWaiting: boolean = false;
  activeIndex: number = 0;
  slideOpts = cubeEffectSlideOpts;

  constructor(private modalController: ModalController, private platform: Platform) {}

  ngOnInit() {
    if (this.slides && this.tapped) {
      this.slides.slideTo(this.tapped);
    }
  }

  ionViewDidEnter() {
    this.setStorySeen();
  }

  async setStorySeen() {
    this.activeIndex = await this.slides.getActiveIndex();
    const story = this.getCurrentStory();
    const storyItem = this.getCurrentStoryItem();

    if (!storyItem.seen) {
      if (story.currentItem === story.items.length - 1) story.seen = true;
      storyItem.seen = true;
    }
  }

  getCurrentStory(): StoryUser {
    return this.stories[this.activeIndex];
  }

  getCurrentStoryItem() {
    const currentStory = this.getCurrentStory();
    if (currentStory) {
      return currentStory.items[currentStory.currentItem];
    }
  }

  changeStoryItem(event: MouseEvent, story: StoryUser) {
    const isHeaderOrFooter: boolean = event.clientY < 70 || event.clientY > this.platform.height() - 70;
    if (isHeaderOrFooter) {
      return;
    }

    const isLeftScreenClick: boolean = event.clientX < this.platform.width() / 2;
    if (isLeftScreenClick) {
      this.previousStoryItem();
    } else {
      this.nextStoryItem();
    }
  }

  previousStoryItem() {
    const currentStory: StoryUser = this.getCurrentStory();
    const isInitialStoryItem: boolean = currentStory.currentItem === 0;
    if (!isInitialStoryItem) {
      currentStory.currentItem--;
      this.setStorySeen();
    } else {
      this.slides.slidePrev();
    }
  }

  async nextStoryItem() {
    const currentStory = this.getCurrentStory();
    const isLastStoryItem: boolean = currentStory.currentItem === currentStory.items.length - 1;
    if (!isLastStoryItem) {
      currentStory.currentItem++;
      this.setStorySeen();
    } else {
      if (await this.slides.isEnd()) {
        this.closeStoryViewer();
      } else {
        this.slides.slideNext();
      }
    }
  }

  pauseStory() {
    this.isPaused = true;
    if (this.video) this.video.pause();
  }

  playStory() {
    this.isPaused = false;
    if (this.video) this.video.play();
  }

  isLoading(indexStory: number): boolean {
    const storyItem = this.getCurrentStoryItem();
    if (storyItem) {
      return !storyItem.duration && storyItem.type == 1 && indexStory === this.activeIndex;
    } else {
      return true;
    }
  }

  onSwipeUp() {
    console.log('Swipe Up!');
  }

  closeStoryViewer() {
    this.modalController.dismiss();
  }
}
