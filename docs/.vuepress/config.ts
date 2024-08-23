import { defaultTheme, defineUserConfig } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { searchPlugin } from "@vuepress/plugin-search";
import { getDirname, path } from "@vuepress/utils";
import { glob } from "glob";

// 自動收錄目錄內文章
let journalFiles = glob
  .sync("docs/journal/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let javaFiles = glob
  .sync("docs/page/Java/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let pythonFiles = glob
  .sync("docs/page/Python/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let phpFiles = glob
  .sync("docs/page/PHP-Laravel/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let frontEndFiles = glob
  .sync("docs/page/Front-end/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let linuxFiles = glob
  .sync("docs/page/Linux/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let dbFiles = glob
  .sync("docs/page/Database/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let containerFiles = glob
  .sync("docs/page/Container/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let cloudFiles = glob
  .sync("docs/page/Cloud-Host/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let toolsFiles = glob
  .sync("docs/page/Tools/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let projectFiles = glob
  .sync("docs/page/SideProject/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let otherFiles = glob
  .sync("docs/page/Other/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let thisSiteFiles = glob
  .sync("docs/page/ThisSite/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));
let gitFiles = glob
  .sync("docs/page/Git/*.md")
  .map((f) => f.replace("docs", "").replace("index.md", ""));

import { description } from "../../package.json";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  lang: "zh-TW",
  // Global title in HTML <head>.
  // If page has title (in frontmatter) or h1 then: <page title/h1> | <global title>
  // e.g <title>Vuepress-DecapCMS-Netlify | VueDN</title>
  title: "ForbiddenMagic",
  // Global description in in HTML <head>.
  // If page has description (in frontmatter) then: <global description is replaced by <page description>
  // <meta name="description" content="...">
  description: description,
  head: [
    [
      "script",
      {
        src: "https://identity.netlify.com/v1/netlify-identity-widget.js",
      },
    ],
    ['link', { rel: 'icon', href: `/feather.png` }],
  ],

  // theme and its config
  theme: defaultTheme({
    logo: "feather.png", // 側欄上方logo
    notFound: ["查無路徑"],
    navbar: [ // 頭頂欄
      {
        text: "數位生活&程式學習",
        // notice the trailing / (for the automatic next and prev links based on the sidebar)
        link: "/",
      },
      {
        text: "心情日記",
        link: "/journal",
      },
      {
        text: "About",
        link: "/about.md",
      },
    ],
    // notice there's a difference between /songs and /songs/
    // We have the /songs to enable this sidebar for /songs and /songs/ paths
    sidebar: { // 側欄
      '/journal':[
        {
          text: "心情札記",
          children: journalFiles,
        },
      ],
      '/': [ //TODO 這樣寫太土味了，改成用個function串入uniArr跟對應的txxxFiles（也是arr）包裝後回傳
        {
          text: "Java",
          collapsible: true,
          children: javaFiles,
        },
        {
          text: "Python",
          collapsible: true,
          children: pythonFiles,
        },
        {
          text: "PHP&Laravel",
          collapsible: true,
          children: phpFiles,
        },
        {
          text: "Front-end",
          collapsible: true,
          children: frontEndFiles,
        },
        {
          text: "Linux",
          collapsible: true,
          children: linuxFiles,
        },
        {
          text: "Git",
          collapsible: true,
          children: gitFiles,
        },
        {
          text: "Database",
          collapsible: true,
          children: dbFiles,
        },
        {
          text: "Container",
          collapsible: true,
          children: containerFiles,
        },
        {
          text: "Cloud&Host",
          collapsible: true,
          children: cloudFiles,
        },
        {
          text: "Tools",
          collapsible: true,
          children: toolsFiles,
        },
        {
          text: "Side Project",
          collapsible: true,
          children: projectFiles,
        },
        {
          text: "Other",
          collapsible: true,
          children: otherFiles,
        },
        {
          text: "本站事務",
          collapsible: true,
          children: thisSiteFiles,
        },
      ],
    },
  }),

  // Replace footer
  alias: {
    "@theme/HomeFooter.vue": path.resolve(
      __dirname,
      "./components/MyHomeFooter.vue"
    ),
  },

  // plugin
  plugins: [
    registerComponentsPlugin({
      // options
      // Absolute path to the components directory
      componentsDir: path.resolve(__dirname, "./components"),
    }),
    searchPlugin({
      // options
      // Default shortcut is key '/'
    }),
  ],
});
