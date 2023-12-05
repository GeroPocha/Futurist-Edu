import type { APIRoute } from 'astro';

export const get: APIRoute = function get(/* { params, request } */) {
	/* IDEA: Can be dynamicized (alternative colors…) */

	const icon = /* html */ `
	<link rel="shortcut icon" href="/static/images/felogo_rework.png" />

`;

	return {
		body: icon,
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	};
};
