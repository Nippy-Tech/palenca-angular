import { LoadLink } from './types';
import { validateLoadArguments, validateCredentials } from './utils';
import { Link } from './link';

export const loadLink: LoadLink = async (
  publicApiKey,
  widgetId
): Promise<Link> => {
  validateLoadArguments(publicApiKey, widgetId);
  await validateCredentials(publicApiKey, widgetId);
  return new Link(widgetId);
};
