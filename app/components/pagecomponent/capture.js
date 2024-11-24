import React, { useEffect, useRef, useState } from 'react';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null); // Ref for the video element
  const [hasPermission, setHasPermission] = useState(false); // Track permission status
  const [isCapturing, setIsCapturing] = useState(false); // Track if the camera is active

  useEffect(() => {
    // Access the camera when the component mounts
    const startCamera = async () => {
      try {
        // Request permission to access the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Assign the video stream to the video element
          setHasPermission(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
      }
    };

    // Start the camera on mount
    startCamera();

    // Cleanup the stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks to release camera
      }
    };
  }, []);

  // Capture a still photo from the video feed
  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame of the video onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to an image data URL (base64)
      const dataUrl = canvas.toDataURL('image/png');

      // Call the parent callback with the captured image
      onCapture(dataUrl);
    }
  };

  return (
    <div className="camera-capture">
      {hasPermission ? (
        <>
          <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
          <button onClick={capturePhoto} className="capture-button">
            Capture Photo
          </button>
        </>
      ) : (
        <p>Unable to access the camera. Please grant permission.</p>
      )}
    </div>
  );
};

export default CameraCapture;
