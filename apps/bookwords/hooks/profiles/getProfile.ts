import { User } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

/**
 * Retrieve the user's profile data
 * @param supabase supabase client
 * @param user user object from useUser()
 * @param setLoading loading setter
 * @param setUsername username setter
 * @param setWebsite website setter
 * @param setAvatarUrl avatar url setter
 */
export default async function getProfile(
  supabase: SupabaseClient<Database>,
  user: User | null,
  setLoading: (loading: boolean) => void,
  setUsername: (username: string | null) => void,
  setWebsite: (website: string | null) => void,
  setAvatarUrl: (avatarUrl: string | null) => void
) {
  try {
    setLoading(true)
    if (!user) throw new Error('No user')

    let { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()

    if (error && status !== 406) {
      throw error
    }

    if (data) {
      setUsername(data.username)
      setWebsite(data.website)
      setAvatarUrl(data.avatar_url)
    }
  } catch (error) {
    alert('Error loading user data!')
    console.log(error)
  } finally {
    setLoading(false)
  }
}
