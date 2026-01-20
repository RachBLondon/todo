import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/callback'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/');

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated
  if (user) {
    // Check if onboarding is completed
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, username')
      .eq('id', user.id)
      .single();

    // If accessing root while authenticated and onboarded, redirect to dashboard
    if (pathname === '/' && profile?.onboarding_completed) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // If onboarding not completed and not on onboarding page, redirect to onboarding
    if (
      !profile?.onboarding_completed &&
      pathname !== '/onboarding' &&
      !pathname.startsWith('/auth/') &&
      pathname !== '/'
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/onboarding';
      return NextResponse.redirect(redirectUrl);
    }

    // If onboarding completed but trying to access onboarding page, redirect to dashboard
    if (profile?.onboarding_completed && pathname === '/onboarding') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
