/* eslint-disable no-unused-vars */
// Extensions
// import { Service } from '../service'

// Utilities
// import { GoToOptions, VuetifyGoToTarget } from 'vuetify/types/services/goto';
import type Vue from 'vue';
import * as easingPatterns from './easing-patterns';
import {
  getContainer,
  getOffset,
} from './util';

// Types

// import { VuetifyServiceContract } from 'vuetify/types/services'

type VuetifyGoToTarget = number | string | HTMLElement | Vue

type VuetifyGoToEasing =
  ((t: number) => number) |
  'linear' |
  'easeInQuad' |
  'easeOutQuad' |
  'easeInOutQuad' |
  'easeInCubic' |
  'easeOutCubic' |
  'easeInOutCubic' |
  'easeInQuart' |
  'easeOutQuart' |
  'easeInOutQuart' |
  'easeInQuint' |
  'easeOutQuint' |
  'easeInOutQuint'

interface GoToOptions {
  container?: string | HTMLElement | Vue
  duration?: number
  offset?: number
  easing?: VuetifyGoToEasing
  appOffset?: boolean
}

// function goTo(target: VuetifyGoToTarget, options?: GoToOptions): Promise<number>;
export function goTo(
  _target: VuetifyGoToTarget,
  _settings: GoToOptions = {}
): Promise<number> {
  const settings: GoToOptions = {
    container: (document.scrollingElement as HTMLElement | null) || document.body || document.documentElement,
    duration: 500,
    offset: 0,
    easing: 'easeInOutCubic',
    appOffset: true,
    ..._settings,
  };
  const container = getContainer(settings.container);

  /* istanbul ignore else */
  // if (settings.appOffset && goTo.framework.application) {
  //   const isDrawer = container.classList.contains('v-navigation-drawer');
  //   const isClipped = container.classList.contains('v-navigation-drawer--clipped');
  //   const { bar, top } = goTo.framework.application as any;

  //   settings.offset += bar;
  //   /* istanbul ignore else */
  //   if (!isDrawer || isClipped) settings.offset += top;
  // }

  const startTime = performance.now();

  let targetLocation: number;
  if (typeof _target === 'number') {
    targetLocation = getOffset(_target) - settings.offset!;
  } else {
    targetLocation = getOffset(_target) - getOffset(container) - settings.offset!;
  }

  const startLocation = container.scrollTop;
  if (targetLocation === startLocation) return Promise.resolve(targetLocation);

  const ease = typeof settings.easing === 'function'
    ? settings.easing
    : easingPatterns[settings.easing!];
  /* istanbul ignore else */
  if (!ease) throw new TypeError(`Easing function "${settings.easing}" not found.`);

  // Cannot be tested properly in jsdom
  /* istanbul ignore next */
  return new Promise(resolve => requestAnimationFrame(function step(currentTime: number) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.abs(settings.duration ? Math.min(timeElapsed / settings.duration, 1) : 1);

    container.scrollTop = Math.floor(startLocation + (targetLocation - startLocation) * ease(progress));

    const clientHeight = container === document.body ? document.documentElement.clientHeight : container.clientHeight;
    const reachBottom = clientHeight + container.scrollTop >= container.scrollHeight;
    if (
      progress === 1
      // Need to go lower but reach bottom
      || (targetLocation > container.scrollTop && reachBottom)
    ) {
      return resolve(targetLocation);
    }

    requestAnimationFrame(step);
  }));
}

// goTo.framework = {} as Record<string, VuetifyServiceContract>;
// goTo.init = () => { };
// extends Service
export class Goto {
  public static property: 'goTo' = 'goTo'

  constructor() {
    // super();

    return goTo;
  }
}
