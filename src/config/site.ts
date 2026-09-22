import type { FooterItem, MainNavItem } from "@/types";

export type SiteConfig = typeof siteConfig;

const links = {
  github: "https://github.com/abdulrahmanOthman", 
  linkedin: "https://linkedin.com/in/abdulrahman-othman",
  x: "https://twitter.com/abdulrahmanDev", 
  email: "mailto:youremail@example.com",
};

export const siteConfig = {
  name: "Abdulrahman Othman",
  description:
    "Portfolio of Abdulrahman Othman – Front-End Developer building modern, accessible, and scalable web applications.",
  url: "https://abdulrahman.dev", 
  ogImage: "https://abdulrahman.dev/opengraph-image.png",
  links,
  mainNav: [
    {
      title: "Projects",
      path: "/projects",
      items: [
        {
          title: "Project 1",
          path: "/projects1",
          description: "View my portfolio of featured and open source projects.",
          items: [],
        },
        {
          title: "Project 2",
          path: "/Project2",
          description: "Read articles and tutorials on web development.",
          items: [],
        },
        {
          title: "Project 3",
          path: "/Project3",
          description: "View and download my resume.",
          items: [],
        },
      ],
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Contact",
      path: "/contact",
    },

  ] satisfies MainNavItem[],
  footerNav: [
    {
      title: "Portfolio",
      items: [
        {
          title: "Projects",
          path: "/projects",
          external: false,
        },
        {
          title: "Blog",
          path: "/blog",
          external: false,
        },
        {
          title: "Resume",
          path: "/resume",
          external: false,
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          title: "About",
          path: "/about",
          external: false,
        },
        {
          title: "Contact",
          path: "/contact",
          external: false,
        },
        {
          title: "Terms",
          path: "/terms",
          external: false,
        },
        {
          title: "Privacy",
          path: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Connect",
      items: [
        {
          title: "GitHub",
          path: links.github,
          external: true,
        },
        {
          title: "LinkedIn",
          path: links.linkedin,
          external: true,
        },
        {
          title: "X",
          path: links.x,
          external: true,
        },
        {
          title: "Email",
          path: links.email,
          external: true,
        },
      ],
    },
    {
      title: "Inspiration",
      items: [
        {
          title: "shadcn/ui",
          path: "https://ui.shadcn.com",
          external: true,
        },
        {
          title: "Vercel",
          path: "https://vercel.com",
          external: true,
        },
        {
          title: "Next.js",
          path: "https://nextjs.org",
          external: true,
        },
        {
          title: "Tailwind CSS",
          path: "https://tailwindcss.com",
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};
