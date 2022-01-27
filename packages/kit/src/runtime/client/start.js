import Root from '__GENERATED__/root.svelte';
// @ts-expect-error - doesn't exist yet. generated by Rollup
import { routes, fallback } from '__GENERATED__/manifest.js';
import { Router } from './router.js';
import { Renderer } from './renderer.js';
import { init } from './singletons.js';
import { set_paths } from '../paths.js';

/**
 * @param {{
 *   paths: {
 *     assets: string;
 *     base: string;
 *   },
 *   target: Node;
 *   session: any;
 *   route: {
 * 	   enabled: boolean;
 *     onError?: import('types/config').RouteOnErrorValue;
 *   },
 *   spa: boolean;
 *   trailing_slash: import('types/internal').TrailingSlash;
 *   hydrate: {
 *     status: number;
 *     error: Error;
 *     nodes: Array<Promise<import('types/internal').CSRComponent>>;
 *     url: URL;
 *     params: Record<string, string>;
 *   };
 * }} opts
 */
export async function start({ paths, target, session, route, spa, trailing_slash, hydrate }) {
	if (import.meta.env.DEV && !target) {
		throw new Error('Missing target element. See https://kit.svelte.dev/docs#configuration-target');
	}

	const renderer = new Renderer({
		Root,
		fallback,
		target,
		session
	});

	const router =
		route && route.enabled
			? new Router({
					base: paths.base,
					routes,
					trailing_slash,
					renderer,
					onError: route.onError
			  })
			: null;

	init({ router, renderer });
	set_paths(paths);

	if (hydrate) await renderer.start(hydrate);
	if (router) {
		if (spa) router.goto(location.href, { replaceState: true }, []);
		router.init_listeners();
	}

	dispatchEvent(new CustomEvent('sveltekit:start'));
}
