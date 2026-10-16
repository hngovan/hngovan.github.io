# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tổng quan

**Keeb Log** là blog tiếng Việt viết bằng Astro 6, đăng tại `https://hngovan.github.io`. Nội dung chính là bàn phím cơ custom (build log, switch, keycap) và một số bài kỹ thuật (SQL, code review). Site được clone từ [hyuki.dev](https://github.com/Snow0406/hyuki.dev), vốn dựa trên astro-erudite. Stack gồm Tailwind v4, shadcn/ui (`src/components/ui`), React islands và MDX. Một số comment trong code vẫn là tiếng Hàn còn lại từ bản gốc.

## Lệnh

Project dùng **Bun** (lockfile là `bun.lock`).

```bash
bun install
bun run dev            # dev server tại http://localhost:1234
bun run build          # astro check (type check) + astro build -> dist/
bun run check          # chỉ type check / validate schema nội dung
bun run lint           # ESLint (lint:fix để tự sửa)
bun run format         # Prettier (format:check để chỉ kiểm tra)
```

- Project không có test.
- Husky pre-commit chạy `bun run format:check`, nên commit sẽ bị chặn nếu file chưa chạy Prettier.
- CI (`.github/workflows/deploy.yml`) chạy `format:check`, `lint` và `check`, rồi build và deploy lên GitHub Pages mỗi lần push lên `main`. CI dùng `bun install --frozen-lockfile`, nên nếu thêm hoặc sửa dependency thì phải commit cả `bun.lock`.

## Kiến trúc

- **Content collections** được khai báo ở `src/content.config.ts` (có schema Zod): `blog`, `projects`, `authors`. Sai frontmatter thì `astro check` sẽ báo lỗi và build fail.
- **`src/lib/data-utils.ts`** là nơi duy nhất truy vấn nội dung. Mọi page đều lấy dữ liệu qua đây. Nó lọc `draft`, sắp xếp theo ngày, gom tag (tag của blog và project gộp chung trong `/tags`), tính thời gian đọc và dựng TOC.
- **URL**: slug lấy từ `routeSlug` nếu có, nếu không thì lấy id của entry (tên thư mục) (`getEntrySlug`). Page nằm ở `src/pages/{blog,project,tags,authors}/[...id].astro`. Danh sách blog được phân trang qua `blog/[...page].astro`.
- **Subpost**: entry có id chứa `/` (ví dụ `blog/my-series/part-2.mdx`) được coi là subpost của thư mục cha. Subpost không hiện trong danh sách, được sắp theo `order`, và có sidebar, TOC, điều hướng riêng.
- **`withBasePath()`** trong `src/lib/utils.ts` phải được dùng cho mọi đường dẫn nội bộ bắt đầu bằng `/` (ảnh trong `public/`, link).
- **Cấu hình site** nằm ở `src/consts.ts`: `SITE` (tiêu đề, locale `vi_VN`, `postsPerPage`, `featuredPostCount`), `NAV_LINKS`, `SOCIAL_LINKS`, `ICON_MAP`.
- **Pipeline Markdown** trong `astro.config.ts` gồm remark-math + rehype-katex, remark-emoji, link ngoài tự mở tab mới (`nofollow noreferrer noopener`), và Expressive Code cho code block (theme github-light/dark, theo `[data-theme]`). Shiki đã bị tắt. Plugin tự viết `remarkCodeFenceMetaAliases` đổi `filename="..."` thành `title="..."`.
- **`functions/api/wakatime.ts`** là Cloudflare Pages Function, proxy WakaTime API (cần env `WAKATIME_API_KEY`). Bento component `WakatimeCalendar.tsx` gọi `/api/wakatime` trước, rồi mới fallback sang JSON share công khai. Trên GitHub Pages function này không chạy.

## Cách viết bài

### Bài blog

Mỗi bài là một thư mục `src/content/blog/<slug>/index.mdx`. Ảnh riêng của bài có thể đặt cùng thư mục và tham chiếu tương đối (ví dụ `image: './cover.jpg'`), hoặc đặt trong `public/static/<slug>/` và tham chiếu bằng `/static/...`.

```mdx
---
title: 'Tiêu đề bài'
description: 'Mô tả ngắn, dùng cho SEO và thẻ bài viết.'
date: '2026-07-19'
image: './cover.jpg' # hoặc '/static/...' hoặc URL
routeSlug: 'slug-khong-dau' # tùy chọn, mặc định là tên thư mục
tags: ['switch', 'linear']
keywords: ['...'] # tùy chọn, cho SEO
authors: ['keeb-log'] # id file trong src/content/authors
draft: true # tùy chọn, ẩn khỏi site
order: 1 # chỉ dùng cho subpost
---
```

- Bài viết bằng tiếng Việt, slug là chữ thường không dấu, nối bằng gạch ngang.
- Bắt đầu nội dung bằng heading `##`, vì tiêu đề bài đã là h1. TOC được dựng từ các heading.
- Không dùng Mermaid. Diagram Mermaid đã bị gỡ khỏi các bài.

### Component MDX hay dùng

Cần import ở đầu bài:

```mdx
import Callout from '@/components/callout.astro'
import ContentFigure from '@/components/mdx/content-figure.astro'
import DataTable from '@/components/mdx/data-table.astro'

<Callout variant="tip" title="Mẹo">
	Nội dung...
</Callout>
// variant: note | tip | warning | danger | important | definition | theorem |
lemma | proof | corollary ...; defaultOpen={false} để thu gọn

<ContentFigure src="/static/<slug>/a.webp" alt="..." caption="..." />
<ContentFigure images={[{ src: '...', alt: '...' }, ...]} columns={2} caption="..." />

<DataTable
	headers={['Cột 1', 'Cột 2']}
	rows={[['a', '<code>b</code>']]}
	align={['left', 'center']}
/>
```

- Ô của `DataTable` nhận HTML dạng chuỗi (ví dụ `<code>`).
- Ảnh hoặc GIF viết bằng `<img>` trực tiếp phải dùng ``src={`${import.meta.env.BASE_URL}static/...`}``.
- Code block hỗ trợ meta của Expressive Code: ` ```js filename="x.js" del={2} ins={5-10} `. Với các ngôn ngữ shell, số dòng tự tắt.
- Link sang bài khác dùng `/blog/<routeSlug>`.

### Ảnh và video

- **Mỗi bài có thư mục media riêng** `public/static/<slug>/`. Không dùng lại ảnh của bài khác. Nếu hai bài cần ảnh minh họa giống nhau, hỏi tác giả xem nên lấy ảnh nào.
- **Ảnh gốc** (ảnh chụp điện thoại, PNG) đổi tên theo nội dung (tiếng Việt không dấu, nối bằng gạch ngang), rồi chuyển sang `.webp`, cạnh dài tối đa 1600px. Máy không có ImageMagick, cwebp hay Pillow, nên dùng `sharp` có sẵn trong `node_modules`. Đặt script `.mjs` tạm ở thư mục gốc repo để resolve được `sharp`, chạy bằng `bun`, xong thì xóa:

  ```js
  import sharp from 'sharp'
  await sharp(src)
  	.rotate()
  	.resize({
  		width: 1600,
  		height: 1600,
  		fit: 'inside',
  		withoutEnlargement: true
  	})
  	.webp({ quality: 82 })
  	.toFile('public/static/<slug>/<ten-anh>.webp')
  ```

- **Ảnh lấy từ mạng** phải ghi nguồn trong `caption` (ví dụ `Nguồn: Deskthority, ...`).
- **Video** `.mp4` để nguyên trong `public/static/<slug>/`. Không có ffmpeg nên không nén được. Nhúng như sau:

  ```mdx
  <figure>
  	<video
  		controls
  		playsinline
  		preload="metadata"
  		class="mx-auto rounded-lg border"
  	>
  		<source
  			src={`${import.meta.env.BASE_URL}static/<slug>/<video>.mp4`}
  			type="video/mp4"
  		/>
  		Trình duyệt của bạn không hỗ trợ video HTML5.
  	</video>
  	<figcaption>...</figcaption>
  </figure>
  ```

### Project (build log bàn phím)

Mỗi project là `src/content/projects/<slug>/index.mdx`, frontmatter dùng `name` (không phải `title`):

- Bắt buộc có `description` và `tags`.
- Tùy chọn có `startDate`, `endDate`, `status` (`Completed | In Progress | Planned | Paused`), `relatedPosts` (danh sách id bài blog) và `sections`.
- `sections` hiển thị ở sidebar và nhận một trong ba `type`:
  - `list` với `items: string[]`
  - `links` với `items: {name, url?, icon?}`
  - `team` với `items: {name, role?}`
- Các field `link`, `contributions`, `team` ở cấp ngoài đã deprecated. Dùng `sections` thay thế.

Ảnh của project để trong `public/static/<slug>/`.
