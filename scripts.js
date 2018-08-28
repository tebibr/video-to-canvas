const video    = document.querySelector('.player')
const canvas   = document.querySelector('.photo');
const ctx 	   = canvas.getContext('2d');
const download = document.querySelector('.download');
let shift      = 0;

const getVideo = () => {
	// Set the video source
    navigator.mediaDevices.getUserMedia({ video: true,  audio: false })
    	.then(mediaStream => {
       		video.srcObject = mediaStream;
       		// video.src = 'bobRoss.mp4';
       		video.play();
      	}
    );
};

const paintToCanvas = () => {
	canvas.width  = video.videoWidth;
	canvas.height = video.videoHeight;

  	setInterval(function() {
  		// Draw video to canvas
  		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	   	// Get the pixels from the canvas
	    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

	    // Put the pixels back
	    ctx.putImageData(pixels, 0, 0);
  	}, 60);
};

const redEffect = pixels => {
	for (i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
		pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
		pixels.data[i + 3] = pixels.data[i + 3]; // Alpha
	}

	return pixels;
};

const rgbSplit = pixels => {
	for (i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0]; // RED
		pixels.data[i + 150] = pixels.data[i + 1]; // GREEN
		pixels.data[i + 200] = pixels.data[i + 2]; // Blue
	}

	return pixels;
}

const greenScreen = pixels => {
	const levels = {
		rmin: 0,
		rmax: 0,
		gmin: 0,
		gmax: 0,
		bmin: 0,
		bmax: 0,
	};

  	for (i = 0; i < pixels.data.length; i += 4) {
	    red   = pixels.data[i + 0];
	    green = pixels.data[i + 1];
	    blue  = pixels.data[i + 2];
	    alpha = pixels.data[i + 3];

	    if (
            red      >= levels.rmin
			&& green >= levels.gmin
			&& blue  >= levels.bmin
			&& red   <= levels.rmax
			&& green <= levels.gmax
			&& blue  <= levels.bmax
        ) {
			pixels.data[i + 3] = 0;
	    }
  	}

  	return pixels;
};

const moveScreen = pixels => {
    shift += 20;

    for (i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[(i + 0 + shift) % pixels.data.length];
        pixels.data[i + 1] = pixels.data[(i + 1 + shift) % pixels.data.length];
        pixels.data[i + 2] = pixels.data[(i + 2 + shift) % pixels.data.length];
    }

    return pixels;
};

const downloadCanvas = () => {
	download.href = canvas.toDataURL('image/png');
};

const getAspectRatio = () => {
    aspectRatio = video.videoHeight / video.videoWidth;
    document.querySelector('body').style.paddingTop = aspectRatio / 2 * 100 + '%';
};

getVideo();
video.addEventListener('canplay', getAspectRatio);
video.addEventListener('canplay', paintToCanvas);
download.addEventListener('click', downloadCanvas);
