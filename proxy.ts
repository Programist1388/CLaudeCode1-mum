import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";

const LOCALE_COOKIE = "locale";

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());

  for (const lang of preferred) {
    if (isLocale(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  const hadLocaleCookie = Boolean(request.cookies.get(LOCALE_COOKIE));
  const locale = hadLocaleCookie
    ? (request.cookies.get(LOCALE_COOKIE)!.value as Locale)
    : detectLocale(request);

  if (!hadLocaleCookie) {
    request.cookies.set(LOCALE_COOKIE, locale);
  }

  function withLocaleCookie(response: NextResponse): NextResponse {
    if (!hadLocaleCookie) {
      response.cookies.set(LOCALE_COOKIE, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return response;
  }

  if (isAdminRoute) {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return new NextResponse(
        "Админ-панель ещё не настроена: не заданы переменные окружения " +
          "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. См. CLAUDE.md.",
        { status: 503 }
      );
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // getUser() (not getSession()) revalidates the token against Supabase Auth
    // rather than trusting a potentially-stale cookie.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLoginRoute = pathname === "/admin/login";

    if (!isLoginRoute && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return withLocaleCookie(NextResponse.redirect(url));
    }

    if (isLoginRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return withLocaleCookie(NextResponse.redirect(url));
    }

    return withLocaleCookie(supabaseResponse);
  }

  return withLocaleCookie(NextResponse.next({ request }));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
