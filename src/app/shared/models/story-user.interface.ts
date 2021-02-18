import { StoryItem } from './story-item.interface';
export interface StoryUser {
  userId: number;
  userPicture: string;
  userName: string;
  currentItem: number;
  seen: boolean;
  items: StoryItem[];
}
