import type { MetadataRoute } from 'next'
import { LANDING_ROUTES } from '@/constants/routes'
import { getWrittenContents } from '@/actions/common/written-content/getWrittenContents'
import { TYPE_WRITTEN_CONTENT } from '@/types/common/index.type'
import { APP_URL } from '@/constants'

// List of private/admin routes
const PRIVATE_ROUTES: string[] = []

export default async function robots(): Promise<MetadataRoute.Robots> {
    // Fetch dynamic content
    const blogResponse = await getWrittenContents({ type: TYPE_WRITTEN_CONTENT.BLOG, page: 1, limit: 100 })
    const storyResponse = await getWrittenContents({ type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES, page: 1, limit: 100 })

    const blogs = blogResponse.writtenContents || []
    const stories = storyResponse.writtenContents || []
    // Generate dynamic URLs
    const dynamicBlogRoutes = blogs.map(post => `${LANDING_ROUTES.BLOG}/${post.id}`)
    const dynamicStoryRoutes = stories.map(story => `${LANDING_ROUTES.SUCCESS_STORIES}/${story.id}`)

    // Combine all public routes
    const publicRoutes = [
        LANDING_ROUTES.HOME,
        LANDING_ROUTES.BLOG,
        LANDING_ROUTES.SUCCESS_STORIES,
        ...dynamicBlogRoutes,
        ...dynamicStoryRoutes,
    ]

    return {
        rules: [
            {
                userAgent: '*',
                allow: publicRoutes,
                disallow: PRIVATE_ROUTES,
            },
        ],
        sitemap: APP_URL + '/sitemap.xml',
    }
}
