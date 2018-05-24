import {EventEmitter2} from 'eventemitter2';
import {AddressChangeSet} from './types/address_change_set';

import * as logger from "winston";

logger.configure({
    transports: [
        new logger.transports.Console({
            colorize: true
        })
    ]
});

const events = new EventEmitter2(); 

export async function setAddress(changeset: AddressChangeSet) {

  events.emit('address:set', changeset);

};

export async function unsetAddress(changeset: AddressChangeSet) {

  events.emit('address:unset', changeset);

};

export { events, logger };

