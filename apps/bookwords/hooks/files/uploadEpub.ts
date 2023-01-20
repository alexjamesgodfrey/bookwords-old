import { User } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from 'types/supabase'

export default async function uploadEpub(
  supabase: SupabaseClient<Database>,
  user: User | null,
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  event: React.ChangeEvent<HTMLInputElement>
) {
  if (!user) return

  if (!event.target.files) return

  try {
    setUploading(true)
    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${file.name}/.${fileExt}`

    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      throw uploadError
    }
  } catch (error) {
    alert(error) // TODO: replace with toast
  } finally {
    setUploading(false)
  }
}
