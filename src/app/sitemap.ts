import type { MetadataRoute } from 'next'
import { LANDING_ROUTES } from '@/constants/routes'
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type'
import { getWrittenContents } from '@/actions/common/written-content/getWrittenContents'
import { IWrittenContent } from '@/types/common/written-content/written-content-response.type'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch blogs
    const blogResponse = await getWrittenContents({ type: TYPE_WRITTEN_CONTENT.BLOG, page: 1, limit: 100 })
    const blogs = blogResponse.writtenContents || []

    // Fetch success stories
    const storiesResponse = await getWrittenContents({ type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES, page: 1, limit: 100 })
    const stories = storiesResponse.writtenContents || []
    const staticPages = [
        { url: LANDING_ROUTES.HOME, lastModified: new Date() },
        { url: LANDING_ROUTES.BLOG, lastModified: new Date() },
        { url: LANDING_ROUTES.SUCCESS_STORIES, lastModified: new Date() },
    ]

    const dynamicBlog = blogs.map((post: IWrittenContent) => ({
        url: `${LANDING_ROUTES.BLOG}/${post.id}`,
        lastModified: new Date(post.updateAt ?? Date.now()),
    }))

    const dynamicStories = stories.map((story: IWrittenContent) => ({
        url: `${LANDING_ROUTES.SUCCESS_STORIES}/${story.id}`,
        lastModified: new Date(story.updateAt ?? Date.now()),
    }))

    return [...staticPages, ...dynamicBlog, ...dynamicStories]
}
