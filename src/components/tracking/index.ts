/**
 * Tracking components barrel
 * ---------------------------
 * Single import path for all tracking primitives.
 *
 *   import { MetaPixel, PageView, trackViewContent } from '@/components/tracking';
 */

export {
  default as MetaPixel,
  newEventId,
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackLead,
} from './MetaPixel';
export { default as PageView } from './PageView';
