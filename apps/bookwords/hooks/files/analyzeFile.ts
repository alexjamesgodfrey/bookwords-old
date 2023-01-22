import { NativeBook } from 'types/GoogleBooks'
import { UploadStep } from 'types/UploadStep'

export default async function analyzeFile(
  fileId: string | null,
  userId: string,
  nativeBook: NativeBook,
  setUploadStep: (uploadStep: UploadStep) => void
) {
  if (!fileId) return

  setUploadStep(UploadStep.ANALYZING)

  console.log(process.env.NEXT_PUBLIC_API_HOST)

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/analysis/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        file_id: fileId,
        native_book: nativeBook,
      }),
    })
  } catch {}
}
