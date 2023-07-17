import { MetadataRoute } from 'next'
import { config } from 'global-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog/post/*/thumbnail']
    },
    sitemap: `${config.webserver.host}/sitemap.xml`
  }
}
