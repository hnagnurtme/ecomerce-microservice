import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = process.hrtime();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);

    const status = res.statusCode;
    const statusColor =
      status >= 500
        ? chalk.red
        : status >= 400
          ? chalk.yellow
          : status >= 300
            ? chalk.cyan
            : chalk.green;

    console.log(
      `${chalk.gray(`[${new Date().toISOString()}]`)} ${chalk.blue(method)} ${chalk.white(originalUrl)} → ${statusColor(status)} ${chalk.magenta(`${durationInMs}ms`)}`
    );
  });

  next();
}
