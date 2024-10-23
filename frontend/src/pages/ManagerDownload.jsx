import React from 'react'

const ManagerDownload = () => {
  return (
    <div>
         <div className="download-waiting-section">
        <img className="download-waiting-icon" alt="Download File Icon" src="/images/DownIMG.jpg" />
        <div className="download-waiting-text">Please wait for a moment ...</div>
      </div>

      <div className="download-button-section">
        <div className="download-button-bg"></div>
        <div className="download-button-text">Download</div>
      </div>
    </div>
  )
}

export default ManagerDownload