document.getElementById('join-btn').addEventListener('click', async () => {
    const meetingUrl = document.getElementById('meeting-url').value;
    if (!meetingUrl) {
        alert('Please enter a meeting URL');
        return;
    }

    const callFrame = window.DailyIframe.createCallObject();

    const addParticipantMedia = (participant) => {
        if (participant.local) return; // Skip the local participant

        const mediaStream = new MediaStream();
        if (participant.videoTrack) {
            mediaStream.addTrack(participant.videoTrack);
        }
        if (participant.audioTrack) {
            mediaStream.addTrack(participant.audioTrack);
        }

        if (mediaStream.getTracks().length > 0) {
            const videoElement = document.createElement('video');
            videoElement.srcObject = mediaStream;
            videoElement.autoplay = true;
            videoElement.muted = participant.local; // Mute local participant to avoid feedback
            document.getElementById('video-container').appendChild(videoElement);
        }
    };

    callFrame.on('participant-joined', (event) => {
        addParticipantMedia(event.participant);
    });

    callFrame.on('track-started', (event) => {
        if (event.participant.local) return; // Skip the local participant

        addParticipantMedia(event.participant);
    });

    await callFrame.join({ url: meetingUrl });
});