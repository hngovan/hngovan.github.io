import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginFrames } from '@expressive-code/plugin-frames'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginTextMarkers } from '@expressive-code/plugin-text-markers'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import type { ExpressiveCodeTheme } from 'rehype-expressive-code'
import rehypeExpressiveCode from 'rehype-expressive-code'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'

const remarkCodeFenceMetaAliases = () => {
	const normalizeMeta = (meta: string) => {
		if (/\btitle=/.test(meta) || !/\bfilename=/.test(meta)) return meta

		return meta.replace(
			/\bfilename=(?:"([^"]+)"|'([^']+)'|(\S+))/g,
			(_, doubleQuoted: string, singleQuoted: string, bare: string) => {
				const value = doubleQuoted ?? singleQuoted ?? bare
				return `title="${value}"`
			}
		)
	}

	const visit = (node: {
		type?: string
		meta?: string
		children?: unknown[]
	}) => {
		if (node.type === 'code' && typeof node.meta === 'string') {
			node.meta = normalizeMeta(node.meta)
		}

		if (Array.isArray(node.children)) {
			for (const child of node.children) {
				visit(child as { type?: string; meta?: string; children?: unknown[] })
			}
		}
	}

	return (tree: { type?: string; meta?: string; children?: unknown[] }) => {
		visit(tree)
	}
}

export default defineConfig({
	site: 'https://hngovan.github.io',
	integrations: [mdx(), react(), sitemap(), icon()],
	vite: {
		plugins: [tailwindcss()]
	},
	server: {
		port: 1234,
		host: true
	},
	devToolbar: {
		enabled: false
	},
	markdown: {
		syntaxHighlight: false,
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					target: '_blank',
					rel: ['nofollow', 'noreferrer', 'noopener']
				}
			],
			rehypeHeadingIds,
			rehypeKatex,
			[
				rehypeExpressiveCode,
				{
					themes: ['github-light', 'github-dark'],
					plugins: [
						pluginFrames(),
						pluginLineNumbers(),
						pluginCollapsibleSections(),
						pluginTextMarkers()
					],
					useDarkModeMediaQuery: false,
					themeCssSelector: (theme: ExpressiveCodeTheme) =>
						`[data-theme="${theme.name.split('-')[1]}"]`,
					defaultProps: {
						wrap: true,
						collapseStyle: 'collapsible-auto',
						overridesByLang: {
							'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
								{
									showLineNumbers: false
								}
						}
					},
					styleOverrides: {
						codeFontSize: '0.75rem',
						borderColor: 'var(--border)',
						codeFontFamily: 'var(--font-mono)',
						codeBackground:
							'color-mix(in oklab, var(--muted) 25%, transparent)',
						frames: {
							editorActiveTabForeground: 'var(--muted-foreground)',
							editorActiveTabBackground:
								'color-mix(in oklab, var(--muted) 25%, transparent)',
							editorActiveTabIndicatorBottomColor: 'transparent',
							editorActiveTabIndicatorTopColor: 'transparent',
							editorTabBorderRadius: '0',
							editorTabBarBackground: 'transparent',
							editorTabBarBorderBottomColor: 'transparent',
							frameBoxShadowCssValue: 'none',
							terminalBackground:
								'color-mix(in oklab, var(--muted) 25%, transparent)',
							terminalTitlebarBackground: 'transparent',
							terminalTitlebarBorderBottomColor: 'transparent',
							terminalTitlebarForeground: 'var(--muted-foreground)'
						},
						lineNumbers: {
							foreground: 'var(--muted-foreground)'
						},
						uiFontFamily: 'var(--font-sans)'
					}
				}
			]
		],
		remarkPlugins: [remarkMath, remarkEmoji, remarkCodeFenceMetaAliases]
	}
})
