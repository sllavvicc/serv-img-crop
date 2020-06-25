import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cluster from 'cluster';
import * as os from 'os';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  await app.listen(3000);
}

/**
 * @description Запуск приложения в режиме кластера
 */
if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('online', worker => {
    Logger.log('Worker ' + worker.process.pid + ' is online.');
  });
  cluster.on('exit', ({ process }) => {
    Logger.log('worker ' + process.pid + ' died.');
  });
} else {
  bootstrap()
    .catch(error => Logger.error(error))
    .then(() => Logger.log('Cluster work on port: 3000'));
}
