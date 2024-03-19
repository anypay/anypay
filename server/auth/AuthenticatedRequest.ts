import { Request } from "@hapi/hapi";

import { accounts as Account } from '@prisma/client'

export default interface AuthenticatedRequest extends Request {
    account: Account;
}
