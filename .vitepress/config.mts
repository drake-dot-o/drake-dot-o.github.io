import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "drake's stuff",
  description: "some basic shit for me to poke around with",
  cleanUrls: true,
  base: '/',
  themeConfig: {
    logo: '/drake.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'home', link: '/' },
      { text: 'projects', link: '/projects' }
    ],
    sidebar: [

      {
        text: 'projects',
        link: '/projects',
        items: [

          { text: 'color picker', link: '/projects/color-picker' },
        
        ]

      },
      {
        text: 'documentation',
        link: '/docs',
        items: [
          
          { text: 'syntax and examples', link: '/docs/syntax-examples' },
          { text: 'runtime api examples', link: '/docs/api-examples' }
        
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/drake-dot-o' }
    ],
    outline: {
      label: 'on this page',
      level: [2, 3]
    }
  }
})
