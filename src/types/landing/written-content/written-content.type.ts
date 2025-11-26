import { IPagination } from '@/types/common/pagination.type';
import { TYPE_WRITTEN_CONTENT } from '../index.type';

export interface IWrittenContent {
  id: number;
  title: string;
  content: string;
  brief?: string;
  imgs: string[];
  createdAt: string | Date;
  updateAt?: string | Date;
  type: TYPE_WRITTEN_CONTENT;
}
export interface IWrittenContentResponse {
  status: number;
  message?: string;
  writtenContent: IWrittenContent;
  error?: string;
}

export interface IWrittenContentsResponse {
  status: number;
  message?: string;
  writtenContents: IWrittenContent[];
  error?: string;
  pagination: IPagination;
}
