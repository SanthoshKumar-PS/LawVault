
export type UploadingFile = {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'completed'
}

const UploadProgress = () => {
  return (
    <div>UploadProgress</div>
  )
}

export default UploadProgress