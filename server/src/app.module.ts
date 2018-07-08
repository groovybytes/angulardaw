import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {InstrumentinfoController} from "./controllers/instrumentinfo.controller";
import {ConfigService} from "./services/config.service";
import * as winston from "winston";
import {format} from "winston";
const Fuse = require("fuse.js");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp}  ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});
@Module({
  imports: [],
  controllers: [AppController,InstrumentinfoController],
  providers: [
    AppService,
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV}.env`),
    },
    {
      provide: "Logger",
      useValue: logger,
    },
    {
      provide: "Fuse",
      useValue: Fuse,
    }

  ],
  exports: [ConfigService]
})
export class AppModule {}

