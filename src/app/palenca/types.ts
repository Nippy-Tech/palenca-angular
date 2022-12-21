import { Link } from './link';
import { WidgetEventSignal } from './enums';

export type Handler<E> = (event: E) => void;

export interface IObjectKeys {
  [key: string]: string | undefined | boolean | number | string[];
}

export interface RenderConfiguration extends IObjectKeys {
  externalId?: string;
  platform?: string;
  isSandbox?: boolean;
  platforms?: string[];
  country?: string;
  redirectUrl?: string;
  hideLogo?: boolean;
  hideWhatsApp?: boolean;
  hideConsent?: boolean;
  lang?: string;
  customPrivacyUrl?: string;
  whatsAppPhoneNumber?: string;
}

export interface RenderAppereance extends IObjectKeys {
  primaryColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}

export interface RenderOptions {
  configuration?: RenderConfiguration;
  appearance?: RenderAppereance;
}

export interface LinkConstructor {
  (publicApiKey: string, widgetId: string): Link;
}

export type LoadLink = (...args: Parameters<LinkConstructor>) => Promise<Link>;

export interface WidgetSearchParams extends IObjectKeys {
  widget_id?: string;
  external_id?: string;
  country?: string;
  platform?: string;
  platforms?: string[];
  is_sandbox?: string;
  hide_logo?: string;
  hide_whatsapp?: string;
  hide_consent?: string;
  font_family?: string;
  primary_color?: string;
  border_radius?: string;
  custom_privacy_url?: string;
  whatsapp_number?: string;
  redirect_url?: string;
  locale?: string;
}

export interface WidgetEvent {
  signal: WidgetEventSignal;
  response: object;
}
