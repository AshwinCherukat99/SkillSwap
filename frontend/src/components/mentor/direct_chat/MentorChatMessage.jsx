import React from "react";

import {FaCheckDouble} from 'react-icons/fa'

const MentorChatMessage=({message,mentorId})=>{
    const sender=message.sender||{}
    const isMentor=sender.type==='MENTOR'&&((mentorId!==null && String(sender.id)===String(mentorId))||message.is_mine===true)
    const time=message.created_at?new Date(message.created_at).toLocaleTimeString([],{
        hour:'numeric',
        minute:'2-digit',
    }):''
    return (
        <div
      className={`message-row ${
        isMentor ? "mentor-message" : "student-message"
      }`}
    >
      {!isMentor && (
        <div>
          {sender.profile_image ? (
            <img
              src={sender.profile_image}
              alt={sender.full_name}
              className="message-avatar"
            />
          ) : (
            <div className="message-avatar avatar-placeholder">
              {sender.full_name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div className="message-content">

        <div className="message-meta">

          {!isMentor && (
            <strong>
              {sender.full_name || "Student"}
            </strong>
          )}

          {isMentor && (
            <strong className="text-primary">
              You
            </strong>
          )}

          <small>{time}</small>

          {isMentor && (
            <FaCheckDouble
              size={12}
              className="text-primary"
            />
          )}

        </div>

        <div className="message-bubble">
          {message.content}
        </div>

      </div>
    </div>
    )
}

export default MentorChatMessage