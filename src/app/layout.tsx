import type { Metadata } from "next"
import { draftMode } from "next/headers"
import localFont from "next/font/local"
import "./globals.css"
import { storyblokInit, apiPlugin, getStoryblokApi } from "@storyblok/react/rsc"
import StoryblokBridgeLoader from "@storyblok/react/bridge-loader"
import StoryblokProvider from "@/components/StoryblokProvider"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

const plusJakartaSans = localFont({
  src: [
    {
      path: "./fonts/PlusJakartaSans[wght].ttf",
      style: "normal",
    },
    {
      path: "./fonts/PlusJakartaSans-Italic[wght].ttf",
      style: "italic",
    },
  ],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Climate Solutions Conference",
  description: "Generated by create next app",
}

storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
  bridge: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
  use: [apiPlugin],
  apiOptions: {
    cache: { type: "memory" },
  },
})

async function getNavigation() {
  const storyblokApi = getStoryblokApi()
  if (!storyblokApi) return

  const isDraftEnabled = draftMode().isEnabled
  const { data } = await storyblokApi.get("cdn/stories/navigation", {
    version: isDraftEnabled ? "draft" : "published",
    resolve_links: "url",
  })

  return data ? data.story : null
}

async function getFooter() {
  const storyblokApi = getStoryblokApi()
  if (!storyblokApi) return

  const isDraftEnabled = draftMode().isEnabled
  const { data } = await storyblokApi.get("cdn/stories/footer", {
    version: isDraftEnabled ? "draft" : "published",
    resolve_links: "url",
  })

  return data ? data.story : null
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navStory = await getNavigation()
  const footerStory = await getFooter()

  return (
    <StoryblokProvider>
      <html lang="en">
        <body
          className={`${plusJakartaSans.className} box-border overflow-x-hidden text-black`}
        >
          <Navigation blok={navStory.content} />
          {children}
          <Footer blok={footerStory.content} />
        </body>
        <StoryblokBridgeLoader options={{}} />
      </html>
    </StoryblokProvider>
  )
}
