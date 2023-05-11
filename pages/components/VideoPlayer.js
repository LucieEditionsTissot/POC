import React from "react";

const VideoPlayer = () => {
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <video
                src="/video-1.mp4"
                style={{
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                }}
                autoPlay
            />
            <video
                src="/video-2.mp4"
                style={{
                    position: "absolute",
                    top: "60px",
                    left: "10px",
                    width: "100%",
                    height: "100%",
                    zIndex: 2,
                }}
                autoPlay
            />
        </div>
    );
};

export default VideoPlayer;




