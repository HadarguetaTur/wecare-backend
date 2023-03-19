import { IReactions } from 'src/api/reactions/interfaces/reactions.interface';
import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';

export interface IPostDocument extends Document {
  _id?: string | mongoose.Types.ObjectId;
  userId: string;
  username: string;
  email: string;
  avatarColor: string;
  profilePicture: string;
  post: string;
  bgColor: string;
  commentsCount: number;
  imgVersion?: string;
  imgId?: string;
  videoVersion?: string;
  videoId?: string;
  feelings?: string;
  gifUrl?: string;
  privacy?: string;
  reactions?: IReactions;
  createdAt?: Date;
  title?:string;
  content?:string;
}

export interface IGetPostsQuery {
  _id?: ObjectId | string;
  username?: string;
  imgId?: string;
  gifUrl?: string;
  videoId?: string;
}

export interface ISavePostToCache {
  key: ObjectId | string;
  currentUserId: string;
  uId: string;
  createdPost: IPostDocument;
}

export interface IPostJobData {
  key?: string;
  value?: IPostDocument;
  keyOne?: string;
  keyTwo?: string;
}

export interface IQueryComplete {
  ok?: number;
  n?: number;
}

export interface IQueryDeleted {
  deletedCount?: number;
}