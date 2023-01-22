import { User } from '@supabase/auth-helpers-nextjs'
import { SupabaseClient } from '@supabase/supabase-js'
import { UploadStep } from 'types/UploadStep'
import { Database } from 'types/supabase'

export default async function uploadEpub(
  supabase: SupabaseClient<Database>,
  user: User | null,
  setUploading: (uploadStep: UploadStep) => void,
  setFileId: (fileId: string | null) => void,
  event: React.ChangeEvent<HTMLInputElement>
) {
  if (!user) return

  if (!event.target.files) return

  try {
    setUploading(UploadStep.UPLOADING)
    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${file.name}.${fileExt}`

    let { error: uploadError } = await supabase.storage
      .from('books')
      .upload(fileName, file, {
        upsert: true,
      })

    if (uploadError) {
      throw uploadError
    }

    setUploading(UploadStep.UPLOAD_COMPLETE)
    setFileId(fileName)
  } catch (error) {
    console.log(error)
    setUploading(UploadStep.UPLOAD_FAILED)
  } finally {
  }
}
