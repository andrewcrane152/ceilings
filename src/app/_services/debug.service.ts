import { Injectable } from '@angular/core';
import * as debug from 'debug';

@Injectable()
export class DebugService {
  private debug = debug;

  constructor() {}

  log(identifier: string, message: any) {
    this.debug('ceilings:' + identifier)(message);
  }
}
