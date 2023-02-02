import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from 'src/config';
import { IAuthJob } from 'src/api/auth/interfaces/auth.interface';
import { IEmailJob } from 'src/api/user/interfaces/user.interface';
import { IPostJobData } from 'src/api/post/interfaces/post.interface';
import { IReactionJob } from 'src/api/reactions/interfaces/reactions.interface';
import { ICommentJob } from 'src/api/comments/interfaces/comment.interface';
import { IBlockedUserJobData, IFollowerJobData } from 'src/api/followers/interfaces/followers.interface';
import { IChatJobData, IMessageData } from 'src/api/chet/interfaces/chet.interface';

type IBaseJobData = IAuthJob | IEmailJob | IPostJobData | IReactionJob | ICommentJob | IFollowerJobData | IBlockedUserJobData | IChatJobData | IMessageData;

let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter
    });

    this.log = config.createLogger(`${queueName}Queue`);

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}