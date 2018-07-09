import {Logger} from "winston";
import {Body, Controller, Inject, Post} from "@nestjs/common";
import {ConfigService} from "../services/config.service";
import {SystemEvent} from "../../../src/app/angular-daw/model/system/SystemEvent";
import {SystemEventType} from "../../../src/app/angular-daw/model/system/SystemEventType";



@Controller('log')
export class LoggingController {

  constructor(private config: ConfigService,
              @Inject('Logger') private logger: Logger) {

  }

  @Post()
  create(@Body() event:SystemEvent):void {
    this.logger.log(event.eventType.toString().toLowerCase(),JSON.stringify(event.data));
  }



}
