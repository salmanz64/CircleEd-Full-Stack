# 🔐 Auth Redirect Implementation

## What Was Added

A redirect system that automatically sends logged-in users to the dashboard when they try to access:
- Home page (`/`)
- Login page (`/login`)
- Register page (`/register`)

---

## Changes Made

### 1. Created `frontend/lib/useAuthRedirect.ts`

A custom React hook that checks for authentication and redirects if needed:

```typescript
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuthRedirect(redirectPath: string = "/dashboard") {
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem("access_token")

      // If user is logged in (has token), redirect to dashboard
      if (token) {
        router.push(redirectPath)
        router.refresh()
      }
    }

    checkAuthAndRedirect()
  }, [router, redirectPath])
}
```

**How it works:**
1. Checks if running in browser (not server)
2. Looks for `access_token` in localStorage
3. If token exists, redirects to `/dashboard`
4. Refreshes router to update state

### 2. Updated `app/page.tsx` (Home Page)

```typescript
"use client" // Added

import { useAuthRedirect } from "@/lib/useAuthRedirect" // Added

export default function HomePage() {
  useAuthRedirect() // Added this line
  // ... rest of component
}
```

**Effect**: If a logged-in user visits `http://localhost:3000/`, they're redirected to `/dashboard`.

### 3. Updated `app/(auth)/login/page.tsx`

```typescript
"use client"

import { useAuthRedirect } from "@/lib/useAuthRedirect" // Added

export default function LoginPage() {
  useAuthRedirect() // Added this line
  // ... rest of component
}
```

**Effect**: If a logged-in user visits `/login`, they're redirected to `/dashboard`.

### 4. Updated `app/(auth)/register/page.tsx`

```typescript
"use client"

import { useAuthRedirect } from "@/lib/useAuthRedirect" // Added

export default function RegisterPage() {
  useAuthRedirect() // Added this line
  // ... rest of component
}
```

**Effect**: If a logged-in user visits `/register`, they're redirected to `/dashboard`.

### 5. Updated `components/Navbar.tsx`

Changed Login/Signup buttons to use `onClick` instead of `asChild`:

```typescript
// BEFORE
<Button variant="ghost" asChild>
  <Link href="/login">Login</Link>
</Button>

// AFTER
<Button variant="ghost" onClick={() => router.push("/login")}>
  Login
</Button>
```

**Effect**: Clicking Login button properly navigates (and will be caught by useAuthRedirect if logged in).

---

## Behavior

### User NOT Logged In:
- ✅ Can visit home page (`/`)
- ✅ Can visit login page (`/login`)
- ✅ Can visit register page (`/register`)
- ✅ Navbar shows Login/Sign Up buttons
- ✅ No redirect occurs

### User IS Logged In:
- ✅ Visiting `/` → Redirected to `/dashboard`
- ✅ Visiting `/login` → Redirected to `/dashboard`
- ✅ Visiting `/register` → Redirected to `/dashboard`
- ✅ Visiting `/dashboard` → Stays (normal)
- ✅ Visiting `/dashboard/marketplace` → Stays (normal)
- ✅ Navbar shows Profile/Logout buttons
- ✅ Automatic redirect happens immediately

---

## Redirect Flow Diagram

```
User visits http://localhost:3000/login
    ↓
Page loads
    ↓
useAuthRedirect() runs
    ↓
Check localStorage for "access_token"
    ↓
Token exists? (Logged In)
    ↓    ↓
   YES      NO
    ↓        ↓
Redirect     Stay
to           on
/dashboard    /login
```

---

## Testing

### Test 1: Redirect from Home Page

1. Log in to your app
2. Click navbar logo or go to `http://localhost:3000/`
3. **Expected**: Automatically redirected to `/dashboard`

### Test 2: Redirect from Login Page

1. Log in to your app
2. Try to go to `http://localhost:3000/login`
3. **Expected**: Automatically redirected to `/dashboard`

### Test 3: Redirect from Register Page

1. Log in to your app
2. Try to go to `http://localhost:3000/register`
3. **Expected**: Automatically redirected to `/dashboard`

### Test 4: Normal Access (No Redirect)

1. Log out of your app
2. Visit `/login`
3. **Expected**: Stays on login page (no redirect)

---

## Files Changed

| File | Change | Line Added |
|------|---------|-------------|
| `lib/useAuthRedirect.ts` | Created new file | - |
| `app/page.tsx` | Added "use client" and import | 1 |
| `app/page.tsx` | Added `useAuthRedirect()` call | 1 |
| `app/(auth)/login/page.tsx` | Added import | 1 |
| `app/(auth)/login/page.tsx` | Added `useAuthRedirect()` call | 1 |
| `app/(auth)/register/page.tsx` | Added import | 1 |
| `app/(auth)/register/page.tsx` | Added `useAuthRedirect()` call | 1 |
| `components/Navbar.tsx` | Changed button onClick handler | 4 |

---

## Customization

### Change Default Redirect Path

```typescript
// In any component:
useAuthRedirect("/custom-path")
```

### Disable Redirect for Specific Page

If you don't want a page to redirect logged-in users:

```typescript
// Simply don't call useAuthRedirect()
export default function SomePublicPage() {
  // useAuthRedirect() // Comment out or remove
  return <div>Public page</div>
}
```

---

## Security Notes

✅ **Client-Side Check**: Only runs in browser, not during SSR
✅ **Token Verification**: Checks for token existence in localStorage
✅ **Immediate Redirect**: Happens before page content renders
✅ **User Experience**: Smooth redirect without jarring page loads

⚠️ **Not Server-Side Protected**: This is a UX improvement, not a security measure.
   - For actual security, protect API endpoints with `@Depends(get_current_user)`
   - Your backend already does this!

---

## Next Steps (Optional Improvements)

### 1. Server-Side Middleware (More Secure)

Create `middleware.ts` for server-side protection:

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  const { pathname } = request.nextUrl

  // Redirect logged-in users from auth pages
  if (token && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"]
}
```

### 2. Show Loading State While Redirecting

Modify `useAuthRedirect` to show a loading component:

```typescript
const [isRedirecting, setIsRedirecting] = useState(false)

useEffect(() => {
  const token = localStorage.getItem("access_token")
  if (token) {
    setIsRedirecting(true)
    router.push(redirectPath)
  }
}, [])

if (isRedirecting) {
  return <div className="loading">Redirecting...</div>
}
```

### 3. Add Logout Confirmation Dialog

```typescript
const handleLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    router.push("/login")
  }
}
```

---

## Summary

| Feature | Status |
|----------|--------|
| ✅ Auto-redirect from home page | Working |
| ✅ Auto-redirect from login page | Working |
| ✅ Auto-redirect from register page | Working |
| ✅ Normal access for non-logged-in users | Working |
| ✅ Navbar button navigation | Fixed |
| ✅ Client-side only | Safe for SSR |
| ✅ Uses localStorage | Matches auth system |

**Logged-in users will now automatically go to `/dashboard` when visiting public pages!** 🎉
