import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(requestUrl.origin + '/auth/sign-in?error=missing-env')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'investor') {
        return NextResponse.redirect(requestUrl.origin + '/investor-dashboard')
      }
      if (profile?.role === 'researcher') {
        return NextResponse.redirect(requestUrl.origin + '/researcher-dashboard')
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
