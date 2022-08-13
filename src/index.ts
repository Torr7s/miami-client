import 'dotenv/config';

import { MiamiClient } from '@structures/client';

const miamiClient: MiamiClient = new MiamiClient();

miamiClient.login();