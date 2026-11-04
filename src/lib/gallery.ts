import type { ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import type { CollectionEntry } from 'astro:content'

import { withBasePath } from '@/lib/utils'

type GalleryImage =
	CollectionEntry<'gallery'>['data']['photos'][number]['image']

export function formatTakenDate(date: Date): string {
	return date.toLocaleDateString('vi-VN', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	})
}

export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10)
}

/** Ảnh trong thư mục album thì Astro tối ưu, ảnh `/static/...` hoặc URL thì dùng nguyên. */
export async function resolveGalleryImage(image: GalleryImage): Promise<{
	local: ImageMetadata | null
	src: string
	fullSrc: string
}> {
	if (typeof image === 'string') {
		const src = image.startsWith('/') ? withBasePath(image) : image
		return { local: null, src, fullSrc: src }
	}

	const full = await getImage({ src: image, width: 1600, format: 'webp' })
	return { local: image, src: image.src, fullSrc: full.src }
}
