import {Severity} from "./Severity";

export class SystemNotification{
  message:string;
  severity:Severity;

  constructor(message: string, severity: Severity) {
    this.message = message;
    this.severity = severity;
  }
}
