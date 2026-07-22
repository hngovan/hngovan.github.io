import type { IconMap, Site, SocialLink } from '@/types'

export const SITE: Site = {
	title: 'Keeb Log',
	description:
		'Blog tiếng Việt ghi lại kiến thức, build log và trải nghiệm bàn phím cơ custom.',
	href: 'https://hngovan.github.io/keeb-log',
	author: 'Keeb Log',
	locale: 'vi_VN',
	featuredPostCount: 1,
	postsPerPage: 4
}

export const NAV_LINKS: SocialLink[] = [
	{ href: '/', label: 'home' },
	{ href: '/blog', label: 'blog' },
	{ href: '/project', label: 'project' },
	{ href: '/tags', label: 'tags' }
]

export const SOCIAL_LINKS: SocialLink[] = [
	{ href: 'https://github.com/', label: 'GitHub' },
	{ href: 'mailto:hello@keeb-log.local', label: 'Email' },
	{ href: '/rss.xml', label: 'RSS' }
]

export const ICON_MAP: IconMap = {
	Website: 'lucide:globe',
	GitHub: 'lucide:github',
	LinkedIn: 'lucide:linkedin',
	Twitter: 'lucide:twitter',
	Email: 'lucide:mail',
	RSS: 'lucide:rss'
}
