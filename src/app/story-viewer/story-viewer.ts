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
      console.log(video);
      this.video = video.nativeElement;
      this.video.onwaiting = () => {
        this.isWaiting = true;
      };
      this.video.onready = this.video.onload = this.video.onplaying = this.video.oncanplay = () => {
        this.isWaiting = false;
      };

      this.video.addEventListener('loadedmetadata', (metadata) => {
        let storyVideo = this.getCurrentStoryItem();

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

  slideOpts = {
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    on: {
      beforeInit: function () {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}cube`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          resistanceRatio: 0,
          spaceBetween: 0,
          centeredSlides: false,
          virtualTranslate: true,
        };

        this.params = Object.assign(this.params, overwriteParams);
        this.originalParams = Object.assign(this.originalParams, overwriteParams);
      },
      setTranslate: function () {
        const swiper = this;
        const {
          $el,
          $wrapperEl,
          slides,
          width: swiperWidth,
          height: swiperHeight,
          rtlTranslate: rtl,
          size: swiperSize,
        } = swiper;
        const params = swiper.params.cubeEffect;
        const isHorizontal = swiper.isHorizontal();
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let wrapperRotate = 0;
        let $cubeShadowEl;
        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $wrapperEl.append($cubeShadowEl);
            }
            $cubeShadowEl.css({ height: `${swiperWidth}px` });
          } else {
            $cubeShadowEl = $el.find('.swiper-cube-shadow');
            if ($cubeShadowEl.length === 0) {
              $cubeShadowEl = swiper.$('<div class="swiper-cube-shadow"></div>');
              $el.append($cubeShadowEl);
            }
          }
        }

        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let slideIndex = i;
          if (isVirtual) {
            slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
          }
          let slideAngle = slideIndex * 90;
          let round = Math.floor(slideAngle / 360);
          if (rtl) {
            slideAngle = -slideAngle;
            round = Math.floor(-slideAngle / 360);
          }
          const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          let tx = 0;
          let ty = 0;
          let tz = 0;
          if (slideIndex % 4 === 0) {
            tx = -round * 4 * swiperSize;
            tz = 0;
          } else if ((slideIndex - 1) % 4 === 0) {
            tx = 0;
            tz = -round * 4 * swiperSize;
          } else if ((slideIndex - 2) % 4 === 0) {
            tx = swiperSize + round * 4 * swiperSize;
            tz = swiperSize;
          } else if ((slideIndex - 3) % 4 === 0) {
            tx = -swiperSize;
            tz = 3 * swiperSize + swiperSize * 4 * round;
          }
          if (rtl) {
            tx = -tx;
          }

          if (!isHorizontal) {
            ty = tx;
            tx = 0;
          }

          const transform$$1 = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${
            isHorizontal ? slideAngle : 0
          }deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;
          if (progress <= 1 && progress > -1) {
            wrapperRotate = slideIndex * 90 + progress * 90;
            if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
          }
          $slideEl.transform(transform$$1);
          if (params.slideShadows) {
            // Set shadows
            let shadowBefore = isHorizontal
              ? $slideEl.find('.swiper-slide-shadow-left')
              : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = isHorizontal
              ? $slideEl.find('.swiper-slide-shadow-right')
              : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
        }
        $wrapperEl.css({
          '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-moz-transform-origin': `50% 50% -${swiperSize / 2}px`,
          '-ms-transform-origin': `50% 50% -${swiperSize / 2}px`,
          'transform-origin': `50% 50% -${swiperSize / 2}px`,
        });

        if (params.shadow) {
          if (isHorizontal) {
            $cubeShadowEl.transform(
              `translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${
                -swiperWidth / 2
              }px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`
            );
          } else {
            const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
            const multiplier =
              1.5 - (Math.sin((shadowAngle * 2 * Math.PI) / 360) / 2 + Math.cos((shadowAngle * 2 * Math.PI) / 360) / 2);
            const scale1 = params.shadowScale;
            const scale2 = params.shadowScale / multiplier;
            const offset$$1 = params.shadowOffset;
            $cubeShadowEl.transform(
              `scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset$$1}px, ${
                -swiperHeight / 2 / scale2
              }px) rotateX(-90deg)`
            );
          }
        }

        const zFactor = swiper.browser.isSafari || swiper.browser.isUiWebView ? -swiperSize / 2 : 0;
        $wrapperEl.transform(
          `translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${
            swiper.isHorizontal() ? -wrapperRotate : 0
          }deg)`
        );
      },
      setTransition: function (duration) {
        const swiper = this;
        const { $el, slides } = swiper;
        slides
          .transition(duration)
          .find(
            '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left'
          )
          .transition(duration);
        if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
          $el.find('.swiper-cube-shadow').transition(duration);
        }
      },
    },
  };

  constructor(private modalController: ModalController, private platform: Platform) {}

  ngOnInit() {
    if (this.slides && this.tapped) {
      console.log(this.stories, this.tapped);
      this.slides.slideTo(this.tapped);
    }
  }

  closeStoryViewer() {
    this.modalController.dismiss();
  }

  getCurrentStory(): StoryUser {
    return this.stories[this.activeIndex];
  }

  async nextStoryItem() {
    if (this.getCurrentStory().currentItem < this.getCurrentStory().items.length - 1) {
      this.getCurrentStory().currentItem++;

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

  getCurrentStoryItem() {
    let currentStory = this.getCurrentStory();

    if (currentStory) return currentStory.items[currentStory.currentItem];
  }

  isLoading(indexStory: number): boolean {
    let storyItem = this.getCurrentStoryItem();

    if (storyItem) {
      return !storyItem.duration && storyItem.type == 1 && indexStory === this.activeIndex;
    } else {
      return true;
    }
  }

  changeStoryItem(event: any, story: any) {
    if (event.clientY < 70 || event.clientY > this.platform.height() - 70) return;

    if (event.clientX < this.platform.width() / 2) {
      if (story.currentItem > 0) {
        story.currentItem--;

        this.setStorySeen();
      } else {
        this.slides.slidePrev();
      }
    } else {
      this.nextStoryItem();
    }
  }

  onSwipeUp() {
    console.log('Swipe Up!');
  }

  async setStorySeen() {
    this.activeIndex = await this.slides.getActiveIndex();
    let story = this.getCurrentStory();
    let storyItem = this.getCurrentStoryItem();

    if (!storyItem.seen) {
      if (story.currentItem === story.items.length - 1) story.seen = true;

      storyItem.seen = true;
    }
  }

  ionViewDidEnter() {
    this.setStorySeen();
  }
}
