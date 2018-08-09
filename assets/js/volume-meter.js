function createAudioMeter(audioContext) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.volume = 0;

	processor.connect(audioContext.destination);

	processor.shutdown =
		function(){
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}

function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0.00001;
    var x;
	var maxAmplitude=Math.abs(buf[0]);
	if(bufLength!=0){
		for (var i=0; i<bufLength; i++) {
			x = Math.abs(buf[i]);
			sum += x * x;
			if(maxAmplitude>x){
				maxAmplitude=x;
			}
		}

		var rms =  Math.sqrt(sum / bufLength/2);
		rms=rms.toFixed(6);
		if(x>0.000001){
			var decibel = 20*(Math.log10(rms/0.000002));		
			this.volume = decibel;
		}
	}
}