import { Request } from "@hapi/hapi";

import {
    accounts as Account,
    Apps as App
} from '@prisma/client'

export default interface AuthenticatedRequest extends Request {
    account: Account;
    account_id: number;
    app_id: number;
    app: App;
    is_public_request?: boolean;
    token?: string;
}
