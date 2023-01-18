import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import Account from 'components/Login/Account'

export default function Login() {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div className="mx-auto w-72">
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
        />
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}
