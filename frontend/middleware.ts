import { type NextRequest, NextResponse } from "next/server"

const supportedLanguages = ["en", "de"]
const defaultLanguage = "de" 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLanguage = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`,
  )
  if (!pathnameHasLanguage) {
    const acceptLanguage = request.headers.get("accept-language")
    let preferredLanguage = defaultLanguage

    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(",")
        .map((item) => item.split(";")[0].trim())
        .find((item) => supportedLanguages.includes(item.substring(0, 2)))

      if (preferredLocale) {
        preferredLanguage = preferredLocale.substring(0, 2)
      }
    }
    const url = new URL(`/${preferredLanguage}${pathname === "/" ? "" : pathname}`, request.url)

    url.search = request.nextUrl.search

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sfavicon.ico|sfavicon.png|images|fonts|studio).*)"],
}