import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import uploadEpub from 'hooks/files/uploadEpub'
import { UploadStep } from 'types/UploadStep'
import { Database } from 'types/supabase'
import { Button } from 'ui'

interface Props {
  setShowLogin: (show: boolean) => void
  uploadStep: UploadStep
  setUploadStep: (step: UploadStep) => void
  setFileId: (fileId: string | null) => void
}

export default function UploadButton({
  setShowLogin,
  uploadStep,
  setUploadStep,
  setFileId,
}: Props) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  return (
    <div>
      {user ? (
        <>
          <input
            style={{
              visibility: 'hidden',
              position: 'absolute',
            }}
            type="file"
            id="epub"
            accept=".epub"
            onChange={(e) =>
              uploadEpub(supabase, user, setUploadStep, setFileId, e)
            }
            disabled={uploadStep === UploadStep.UPLOADING}
          />
          <label htmlFor="epub" className="cursor-pointer">
            <Button
              variant="primary"
              arrow="up"
              className="pointer-events-none"
            >
              Upload epub
            </Button>
          </label>
        </>
      ) : (
        <Button
          variant="primary"
          arrow="up"
          className=""
          onClick={() => setShowLogin(true)}
        >
          Upload epub
        </Button>
      )}
    </div>
  )
}
