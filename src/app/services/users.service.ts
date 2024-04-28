import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Users } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: AngularFirestore) {}

  updateLikesVideo(video: Users, userId: string) {
    return this.firestore
      .collection('likes')
      .doc(userId)
      .set(
        {
          [video.id]: {
            likesCount: video.likesCountVideo,
            likedBy: video.likedByVideo,
          },
        },
        { merge: true }
      );
  }
}
