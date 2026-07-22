import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: z.coerce.date(),
			routeSlug: z.string().optional(),
			order: z.number().optional(),
			image: image().optional(),
			tags: z.array(z.string()).optional(),
			authors: z.array(z.string()).optional(),
			draft: z.boolean().optional()
		})
})

const authors = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/authors' }),
	schema: z.object({
		name: z.string(),
		pronouns: z.string().optional(),
		avatar: z.url().or(z.string().startsWith('/')),
		bio: z.string().optional(),
		mail: z.email().optional(),
		website: z.url().optional(),
		twitter: z.url().optional(),
		github: z.url().optional(),
		linkedin: z.url().optional(),
		discord: z.url().optional()
	})
})

const projects = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			description: z.string(),
			tags: z.array(z.string()),
			image: z.string().startsWith('/').or(z.url()).or(image()).optional(),
			routeSlug: z.string().optional(),
			startDate: z.coerce.date().optional(),
			endDate: z.coerce.date().optional(),
			status: z
				.enum(['Completed', 'In Progress', 'Planned', 'Paused'])
				.optional(),
			draft: z.boolean().optional(),
			relatedPosts: z.array(z.string()).optional(),

			sections: z
				.array(
					z.discriminatedUnion('type', [
						z.object({
							title: z.string(),
							type: z.literal('links'),
							items: z.array(
								z.object({
									icon: z.string().optional(),
									name: z.string(),
									url: z.url().optional()
								})
							)
						}),
						z.object({
							title: z.string(),
							type: z.literal('list'),
							items: z.array(z.string())
						}),
						z.object({
							title: z.string(),
							type: z.literal('team'),
							items: z.array(
								z.object({
									name: z.string(),
									role: z.string().optional()
								})
							)
						})
					])
				)
				.optional(),

			// 기존 호환성을 위해 유지 (deprecated)
			link: z
				.array(
					z.object({
						icon: z.string().optional(),
						name: z.string(),
						url: z.url().optional()
					})
				)
				.optional(),
			contributions: z.array(z.string()).optional(),
			team: z
				.array(
					z.object({
						name: z.string(),
						role: z.string().optional()
					})
				)
				.optional()
		})
})

export const collections = { blog, authors, projects }
