// Audio Visualizer Class
class RainbowSineWaveVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.statusDiv = document.getElementById('status');
        
        // Audio context and nodes
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.bufferLength = null;
        
        // Animation
        this.animationId = null;
        this.time = 0;
        
        // Wave properties
        this.waveCount = 5;
        this.waveSpeed = 0.05;
        this.baseAmplitude = 50;
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Button event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        // Add demo mode button if in testing environment
        this.addDemoMode();
    }
    
    addDemoMode() {
        const demoBtn = document.createElement('button');
        demoBtn.id = 'demoBtn';
        demoBtn.className = 'btn';
        demoBtn.textContent = 'Demo Mode';
        demoBtn.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        
        this.startBtn.parentElement.appendChild(demoBtn);
        
        demoBtn.addEventListener('click', () => this.startDemoMode());
    }
    
    startDemoMode() {
        this.updateStatus('✨ Demo mode active - Simulating audio input ✨');
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        document.getElementById('demoBtn').disabled = true;
        
        // Simulate audio data
        this.demoMode = true;
        this.time = 0;
        this.animateDemo();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
    }
    
    async start() {
        try {
            this.updateStatus('Requesting microphone access...');
            
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            
            // Update UI
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.updateStatus('✨ Visualizer active - Make some noise! ✨');
            
            // Start animation
            this.animate();
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.updateStatus('❌ Microphone access denied. Please allow microphone access.');
        }
    }
    
    stop() {
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Stop audio context
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        // Clear microphone
        if (this.microphone && this.microphone.mediaStream) {
            this.microphone.mediaStream.getTracks().forEach(track => track.stop());
        }
        
        // Clear demo mode
        this.demoMode = false;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Update UI
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        const demoBtn = document.getElementById('demoBtn');
        if (demoBtn) demoBtn.disabled = false;
        this.updateStatus('Click "Start Visualizer" to begin');
    }
    
    updateStatus(message) {
        this.statusDiv.textContent = message;
    }
    
    getAudioData() {
        if (this.demoMode) {
            // Simulate varying audio data
            const avgAmplitude = 0.3 + Math.sin(this.time * 0.5) * 0.2 + Math.random() * 0.1;
            const freqInfluence = 0.4 + Math.cos(this.time * 0.3) * 0.2 + Math.random() * 0.1;
            return { avgAmplitude, freqInfluence };
        }
        
        this.analyser.getByteTimeDomainData(this.dataArray);
        
        // Calculate average amplitude
        let sum = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            const normalized = (this.dataArray[i] - 128) / 128;
            sum += Math.abs(normalized);
        }
        const avgAmplitude = sum / this.bufferLength;
        
        // Get frequency data for variation
        const freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(freqData);
        
        // Calculate dominant frequency influence
        let freqSum = 0;
        for (let i = 0; i < 50; i++) { // Focus on lower frequencies for better response
            freqSum += freqData[i];
        }
        const freqInfluence = freqSum / (50 * 255);
        
        return { avgAmplitude, freqInfluence };
    }
    
    getRainbowColor(offset, total) {
        const hue = (offset / total) * 360;
        return `hsl(${hue}, 100%, 50%)`;
    }
    
    drawSineWave(offset, amplitude, frequency, color, alpha = 1) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = alpha;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        const centerY = this.canvasHeight / 2;
        const points = 200;
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * this.canvasWidth;
            const normalizedX = i / points;
            
            // Create sine wave with time offset for animation
            const angle = (normalizedX * frequency * Math.PI * 2) + this.time + offset;
            const y = centerY + Math.sin(angle) * amplitude;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    renderWaves() {
        // Clear canvas with slight trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Get audio data
        const { avgAmplitude, freqInfluence } = this.getAudioData();
        
        // Calculate responsive amplitude based on audio input
        const responsiveAmplitude = this.baseAmplitude + (avgAmplitude * 150);
        const responsiveFrequency = 2 + (freqInfluence * 3);
        
        // Draw multiple rainbow sine waves
        for (let i = 0; i < this.waveCount; i++) {
            const offset = (i / this.waveCount) * Math.PI * 2;
            const color = this.getRainbowColor(i, this.waveCount);
            const alpha = 0.6 + (avgAmplitude * 0.4);
            
            // Add slight variation to each wave
            const waveAmplitude = responsiveAmplitude * (0.8 + Math.sin(this.time * 0.5 + offset) * 0.2);
            const waveFrequency = responsiveFrequency * (0.9 + Math.cos(this.time * 0.3 + offset) * 0.1);
            
            this.drawSineWave(offset, waveAmplitude, waveFrequency, color, alpha);
        }
        
        // Add glow effect for the center line
        this.ctx.shadowBlur = 20 + (avgAmplitude * 30);
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        
        // Draw a brighter central wave
        const centerColor = this.getRainbowColor(this.time * 10, 360);
        this.drawSineWave(0, responsiveAmplitude * 0.5, responsiveFrequency, centerColor, 1);
        
        this.ctx.shadowBlur = 0;
        
        // Increment time for animation
        this.time += this.waveSpeed;
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.renderWaves();
    }
    
    animateDemo() {
        this.animationId = requestAnimationFrame(() => this.animateDemo());
        this.renderWaves();
    }
}

// Initialize visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RainbowSineWaveVisualizer();
});
