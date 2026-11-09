import React,{useState,useRef} from 'react'

const ChatInput=({onSend,onUploadFiles,disabled})=>{
    const [message,setMessage]=useState("")
    const [selectedFiles,setSelectedFiles]=useState([])
    const [uploading,setUploading]=useState(false)
    const [uploadError,setUploadError]=useState('')
    const fileInputRef=useRef(null)
    const sendMessage=()=>{
      const trimmed=message.trim()
      if (disabled||!trimmed) return
      onSend(trimmed)
      setMessage('')
    }
    const handleKeyDown=(e)=>{
        if (e.key==='Enter' && !e.shiftKey){
            e.preventDefault()
            sendMessage()
        }
    }
    const handleFileSelection=(event)=>{
      const files=Array.from(event.target.files||[])
      if (!files.length) return
      setUploadError('')
      setSelectedFiles((previous)=>{
        const combined=[...previous,...files]
        if (combined.length>5){
          setUploadError('you can upload a maximum of 5 files per message')
          return combined.slice(0,5)
        }
        const oversizedFile=files.find(
          (file)=>file.size>10*1024*1024
        )
        if (oversizedFile){
          setUploadError(`${oversizedFile.name} exceeds 10 mb size limit`)
          return previous
        }
        return combined
      })
      event.target.value=''
    }
    const removeFile=(index)=>{
      setSelectedFiles((previous)=>
      previous.filter((_,i)=>i!==index))
    }
    const sendFiles=async ()=>{
      if (disabled||uploading||selectedFiles.length===0||!onUploadFiles){
        return
      }
      try{
        setUploading(true)
        setUploadError('')
        await onUploadFiles(selectedFiles)
        setSelectedFiles([])
      }catch(err){
        console.error('file upload failed:',err)
        setUploadError(
          err?.response?.data?.detail||
          err?.response?.data?.error||
          'file upload failed, please try again'
        )
      }finally{
        setUploading(false)
      }
    }
    const handleSubmit=async ()=>{
      if (disabled||uploading) return
      if (message.trim()){
        sendMessage()
      }
      if (selectedFiles.length>0){
        await sendFiles()
      }
    }
    return (
        <form
            className="chat-input-wrapper p-3 border-top bg-white"
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
            }}
        >
            <div className="d-flex flex-column gap-2">

                {selectedFiles.length > 0 && (
                    <div className="selected-files">
                        {selectedFiles.map((file, index) => (
                            <div
                                className="selected-file"
                                key={`${file.name}-${index}`}
                            >
                                <i className="bi bi-file-earmark me-2"></i>

                                <span>{file.name}</span>

                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading}
                                    title="Remove file"
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex align-items-end gap-2">

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileSelection}
                    />

                    <button
                        type="button"
                        className="btn btn-light rounded-circle"
                        disabled={disabled || uploading || selectedFiles.length >= 5}
                        title="Attach files"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <i className="bi bi-paperclip"></i>
                    </button>

                    <textarea
                        className="form-control chat-textarea"
                        placeholder="Type your message..."
                        rows="1"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={disabled || uploading}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary rounded-circle send-button"
                        disabled={
                            disabled ||
                            uploading ||
                            (!message.trim() && selectedFiles.length === 0)
                        }
                    >
                        {uploading ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                            />
                        ) : (
                            <i className="bi bi-send-fill"></i>
                        )}
                    </button>

                </div>
            </div>

            {uploading && (
                <div className="small text-muted mt-2">
                    Uploading documents...
                </div>
            )}

            {uploadError && (
                <div className="text-danger small mt-2">
                    {uploadError}
                </div>
            )}

            <div className="text-muted small mt-2 text-center">
                Press <strong>Enter</strong> to send.
                Press <strong>Shift + Enter</strong> for a new line.
            </div>
        </form>
    )
}  

export default ChatInput