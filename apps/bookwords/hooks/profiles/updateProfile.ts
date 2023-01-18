import { SupabaseClient, User } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

type Profiles = Database['public']['Tables']['profiles']['Row']

/**
 * Update the user's profile
 * @param supabase supabase client
 * @param user user object from useUser()
 * @param setLoading loading setter
 * @param param3 object containing username, website, and avatar_url
 */
export default async function updateProfile(
  supabase: SupabaseClient<Database>,
  user: User | null,
  setLoading: (loading: boolean) => void,
  {
    username,
    website,
    avatar_url,
  }: {
    username: Profiles['username']
    website: Profiles['website']
    avatar_url: Profiles['avatar_url']
  }
) {
  try {
    setLoading(true)
    if (!user) throw new Error('No user')

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date().toISOString(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)
    if (error) throw error
    alert('Profile updated!')
  } catch (error) {
    alert('Error updating the data!')
    console.log(error)
  } finally {
    setLoading(false)
  }
}
