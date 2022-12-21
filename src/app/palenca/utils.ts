import {
  IObjectKeys,
  RenderAppereance,
  RenderConfiguration,
  RenderOptions,
  WidgetSearchParams,
} from './types';
import { config } from './config';

export const generateUniqueId = (length: number = 16): string => {
  return `id_${parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace('.', '')
  )}`;
};

export const validateLoadArguments = (
  publicApiKey?: string,
  widgetId?: string
) => {
  if (!publicApiKey || typeof publicApiKey !== 'string') {
    throw new Error('Expected publicApiKey to be a string');
  }

  if (!widgetId || typeof widgetId !== 'string') {
    throw new Error('Expected widgetId to be a string');
  }
};

export const validateCredentials = async (
  publicApiKey?: string,
  widgetId?: string
) => {
  const payload = {
    widget_id: widgetId,
  };
  const response = await fetch(`${config.apiBaseUrl}/v1/link/authorize`, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': publicApiKey!,
    },
  });

  if (response.status !== 200) {
    throw new Error('publicApiKey or Widget ID are invalid');
  }
};

export const validateRenderArguments = (
  containerId: string,
  options?: RenderOptions
) => {
  if (!containerId || typeof containerId !== 'string') {
    throw new Error('Expected containerId to be a string');
  }

  if (options && typeof options !== 'object') {
    throw new Error('Expected options to be an object');
  }
};

export const queryParams = (params: IObjectKeys): string => {
  let newParams = Object.keys(params).map(key => {
    const value = params[key];
    if (value instanceof Array) {
      if (value.length > 0) {
        return `${encodeURIComponent(key)}=${value.join(',')}`;
      }
    }
    if (typeof value === 'string' || typeof value === 'boolean') {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    return undefined;
  });

  return newParams.filter(param => param != undefined).join('&');
};

export const parseSearchParams = (
  widgetId: string,
  options?: RenderOptions
): string => {
  let params: WidgetSearchParams = {
    widget_id: widgetId,
  };

  if (options && options.configuration) {
    const configuration = options.configuration;
    const renderConfiguration: RenderConfiguration = {
      external_id: configuration.externalId,
      platform: configuration.platform,
      is_sandbox: configuration.isSandbox,
      platforms: configuration.platforms,
      country: configuration.country,
      redirect_url: configuration.redirectUrl,
      hide_logo: configuration.hideLogo,
      hide_whatsapp: configuration.hideWhatsApp,
      hide_consent: configuration.hideConsent,
      lang: configuration.lang,
      custom_privacy_url: configuration.customPrivacyUrl,
      whatsapp_number: configuration.whatsAppPhoneNumber,
    };

    params = { ...params, ...renderConfiguration };
  }

  if (options && options.appearance) {
    const appearance = options.appearance;
    const renderAppearance: RenderAppereance = {
      border_radius: appearance.borderRadius,
      font_family: appearance.fontFamily,
    };

    if (appearance.hasOwnProperty('primaryColor')) {
      let urlSafeColor = appearance.primaryColor;
      if (urlSafeColor && urlSafeColor.charAt(0) === '#') {
        urlSafeColor = urlSafeColor.slice(1);
      }
      renderAppearance["primary_color"] = urlSafeColor;
    }
    params = { ...params, ...renderAppearance };
  }

  return queryParams(params);
};

export const renderFrame = (
  widgetId: string,
  containerId: string,
  options?: RenderOptions
): string => {
  const $container = document.getElementById(containerId);

  if (!$container) {
    throw new Error('Container with id ' + containerId + ' not found');
  }

  const searchParams = parseSearchParams(widgetId, options);
  const id = generateUniqueId();
  const iframe = document.createElement('iframe');
  iframe.id = id;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  iframe.src = `${config.widgetBaseUrl}?${searchParams}`;
  $container.appendChild(iframe);
  return id;
};

export const removeFrame = (frameId: string) => {
  const iframe = document.getElementById(frameId);
  iframe?.remove();
};
