import config from 'config';

import { MessariClient } from '@torr7s/messari-client';

import { MessariConfigProps } from '@/config/default';

const messariConfig: MessariConfigProps = config.get<
  MessariConfigProps
>('app.resources.messari')

export default new MessariClient(messariConfig.api.key);