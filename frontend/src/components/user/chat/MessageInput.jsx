import React,{useEffect,useState,useRef} from "react";

const MessageInput=({onSend,onUploadFiles,connected})=>{
    const [message,setMessage]=useState('')
    const textareaRef=useRef(null)     
    const [uploading,setUploading]=useState(false)
    const [uploadError,setUploadError]=useState('')
    const fileInputRef=useRef(null)
    const [selectedFiles,setSelectedFiles]=useState([])
    useEffect(()=>{
        const textarea=textareaRef.current
        if (!textarea){
            return null
        }
        textarea.style.height='auto'
        textarea.style.height=`${Math.min(textarea.scrollHeight,130)}px`
    },[message])
    const sendMessage=()=>{
        const trimmed=message.trim()
        if (!trimmed){
            return
        }
        if (!connected){
            return
        }
        onSend(trimmed)
        setMessage('')
    }
    const handleKeyDown=(event)=>{
        if (event.key==='Enter'&&!event.shiftKey){
            event.preventDefault()
            sendMessage()
        }
    }
    const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length) {
        setSelectedFiles((previous) => [
            ...previous,
            ...files,
        ]);
        setUploadError("");
    }

    event.target.value = "";
};
const sendFiles = async () => {
    if (!connected || !selectedFiles.length || uploading) {
        return;
    }

    try {
        setUploading(true);
        setUploadError("");

        await onUploadFiles(selectedFiles);

        setSelectedFiles([]);
    } catch (error) {
        console.error("File upload failed:", error);

        setUploadError(
            error?.response?.data?.detail ||
            error?.response?.data?.error ||
            "File upload failed."
        );
    } finally {
        setUploading(false);
    }
};
    return (
        <div className="chat-input-container">

            <div className="chat-input-box">

                <div className="flex-grow-1">

                    {selectedFiles.length > 0 && (
    <div className="selected-files">
        {selectedFiles.map((file, index) => (
            <div
                className="selected-file"
                key={`${file.name}-${index}`}
            >
                <i className="bi bi-file-earmark"></i>

                <span>{file.name}</span>

                <button
                    type="button"
                    onClick={() =>
                        setSelectedFiles((previous) =>
                            previous.filter(
                                (_, i) => i !== index
                            )
                        )
                    }
                    title="Remove file"
                >
                    <i className="bi bi-x"></i>
                </button>
            </div>
        ))}
    </div>
)}

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        rows="1"
                        disabled={!connected}
                        className="form-control chat-textarea"
                        placeholder={
                            connected
                                ? 'Type your message...'
                                : 'Connecting to chat...'
                        }
                    />


                    <div className="chat-input-tools">

                        <input 
                        ref={fileInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileSelection} />

                        <button
                            type="button"
                            className="btn btn-sm btn-link text-muted"
                            disabled={!connected||uploading}
                            title="Attach files"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <i className="bi bi-paperclip"></i>
                        </button>


                        <button
                            type="button"
                            className="btn btn-sm btn-link text-muted"
                            disabled
                            title="Emoji coming soon"
                        >
                            <i className="bi bi-emoji-smile"></i>
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    className="btn btn-primary send-button"
                    onClick={async () => {
        if (message.trim()) {
            sendMessage();
        }

        if (selectedFiles.length > 0) {
            await sendFiles();
        }
    }}
                    disabled={
        !connected ||
        (!message.trim() && selectedFiles.length === 0) ||
        uploading
    }
                >
                    <i className="bi bi-send-fill"></i>
                </button>

            </div>

               {uploading && (
    <div className="chat-input-hint">Uploading files...</div>
)}

{uploadError && (
    <div className="text-danger small mt-1">{uploadError}</div>
)}     

            <div className="chat-input-hint">

                Press <strong>Enter</strong> to send.
                Press <strong>Shift + Enter</strong> for a new line.

            </div>

        </div>
    )
}

export default MessageInput