import 'dotenv/config';
import './shared/utils/alias';

import MiamiClient from './structures/client';

const miamiClient: MiamiClient = new MiamiClient();

miamiClient.login();