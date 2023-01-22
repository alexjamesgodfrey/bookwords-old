import { useUser } from '@supabase/auth-helpers-react'
import UploadButton from 'components/Upload/UploadButton'
import analyzeFile from 'hooks/files/analyzeFile'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GoogleBookItem } from 'types/GoogleBooks'
import { UploadStep } from 'types/UploadStep'
import { Button, Spinner } from 'ui'
import getNativeBook from 'utils/getNativeBook'

interface Props {
  setShowLogin: (show: boolean) => void
  book: GoogleBookItem
}

export default function Upload({ setShowLogin, book }: Props) {
  const router = useRouter()
  const user = useUser()

  const [uploadStep, setUploadStep] = useState(UploadStep.BEGIN)
  const [fileId, setFileId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = async () => {
      if (progress === 100) return setUploadStep(UploadStep.ANALYSIS_COMPLETE)

      await new Promise((r) => setTimeout(r, Math.random() * 200))

      setProgress(progress + 1)
    }

    if (uploadStep === UploadStep.ANALYZING) updateProgress()
  }, [uploadStep, progress])

  switch (uploadStep) {
    case UploadStep.BEGIN:
      return (
        <div className="flex w-96 flex-col items-center rounded-lg border border-gray-200 p-4 sm:w-full">
          <div>
            <h3 className="m-0">Nothing yet!</h3>
            <p className="m-0 py-2 text-gray-400">
              Upload an epub file for analysis. Your contribution will be
              public! <span className="underline">Learn more.</span>
            </p>
          </div>
          <UploadButton
            setShowLogin={setShowLogin}
            uploadStep={uploadStep}
            setUploadStep={setUploadStep}
            setFileId={setFileId}
          />
        </div>
      )
    case UploadStep.UPLOADING:
      return (
        <div className="flex w-96 flex-col items-center rounded-lg border border-gray-200 p-4">
          <h3 className="m-0">Uploading...</h3>
          <Spinner />
          <p className="m-0 py-2 text-gray-400">
            Your epub is being uploaded. This may take a while.
          </p>
        </div>
      )
    case UploadStep.UPLOAD_FAILED:
      return (
        <div className="flex w-96 flex-col items-center rounded-lg border border-red-200 p-4">
          <div>
            <h3 className="m-0">Upload failed</h3>
            <p className="m-0 py-2 text-gray-400">
              Something went wrong. Please try again.
            </p>
          </div>
          <UploadButton
            setShowLogin={setShowLogin}
            uploadStep={uploadStep}
            setUploadStep={setUploadStep}
            setFileId={setFileId}
          />
        </div>
      )
    case UploadStep.UPLOAD_COMPLETE:
      return (
        <div className="flex w-96 flex-col items-center rounded-lg border border-green-200 p-4">
          <div>
            <h3 className="m-0">Upload complete</h3>
            <p className="m-0 py-2 text-gray-400">
              Select chapter functionality coming soon
            </p>
            <Button
              variant="primary"
              onClick={() =>
                analyzeFile(fileId, user.id, getNativeBook(book), setUploadStep)
              }
            >
              Begin Analysis
            </Button>
          </div>
        </div>
      )
    case UploadStep.ANALYZING:
      return (
        <div className="flex w-96 flex-col items-center rounded-lg border border-gray-200 p-4">
          <h3 className="m-0">Analyzing...</h3>
          <Spinner />
          <div className="mb-1 flex w-full justify-between">
            <span className="text-base font-medium text-blue-700 dark:text-white">
              Analyzing...
            </span>
            <span className="text-sm font-medium text-blue-700 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: progress + '%' }}
            ></div>
          </div>
          <p className="m-0 py-2 text-gray-400">
            Your epub is being analyzed. This may take a while.
          </p>
        </div>
      )
    case UploadStep.ANALYSIS_COMPLETE:
      return (
        <div className="flex w-96 flex-col items-center rounded-lg border border-green-200 p-4">
          <div>
            <h3 className="m-0">Analysis complete</h3>
            <p className="m-0 py-2 text-gray-400">
              Thanks so much for your contribution. Refresh the page to see your
              analysis!
            </p>
            <Button variant="primary" onClick={() => router.reload()}>
              Reload Page
            </Button>
            <p>Add share links here</p>
          </div>
        </div>
      )
  }

  return <></>
}
