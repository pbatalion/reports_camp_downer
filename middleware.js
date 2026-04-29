export const config = {
  matcher: ['/((?!login|enrollment_analysis|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Get password from env or use default
  const BOARD_PASSWORD = process.env.BOARD_PASSWORD || 'downer2026';

  // Parse cookies
  const cookies = Object.fromEntries(
    (request.headers.get('cookie') || '').split('; ').map(c => {
      const [key, ...val] = c.split('=');
      return [key, val.join('=')];
    })
  );

  const boardAuth = cookies['board_auth'];

  // Main site requires board password
  if (boardAuth !== BOARD_PASSWORD) {
    return Response.redirect(new URL(`/login.html?redirect=${encodeURIComponent(pathname)}&type=board`, request.url));
  }
}
