# 🌈 Rainbow Sine Wave Audio Visualizer

An epic real-time audio visualizer that transforms microphone input into a living rainbow sine wave across the screen — smooth motion, responsive to sound, pure energy.

## ✨ Features

- 🎵 Real-time microphone audio visualization
- 🌈 Colorful rainbow sine waves with smooth animations
- 📱 Fully responsive design (works on desktop, tablet, and mobile)
- 🎭 Demo mode for testing without microphone
- 💫 Dynamic response to sound amplitude and frequency
- 🎨 Beautiful gradient UI with glassmorphism effects

## 🚀 Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Click **"Start Visualizer"** and grant microphone permission
3. Make some noise and watch the rainbow waves dance!
4. Or click **"Demo Mode"** to see it without a microphone

## 🛠️ Technical Stack

- **HTML5 Canvas** - High-performance rendering
- **Web Audio API** - Real-time audio processing
- **Vanilla JavaScript** - No dependencies required
- **CSS3** - Modern responsive styling

## 📂 Project Structure

```
OndaNew/
├── index.html      # Main HTML structure
├── style.css       # Responsive styling
├── visualizer.js   # Audio visualization engine
└── README.md       # Documentation
```

## 🎯 How It Works

1. **Audio Capture**: Uses `getUserMedia()` to access the microphone
2. **Analysis**: Processes audio with `AnalyserNode` for frequency and amplitude data
3. **Visualization**: Renders rainbow sine waves on HTML5 Canvas
4. **Animation**: 60fps smooth animations using `requestAnimationFrame()`

## 🌟 Browser Compatibility

Works on all modern browsers that support:
- Web Audio API
- HTML5 Canvas
- getUserMedia API

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Design

The visualizer automatically adapts to different screen sizes:
- Desktop: 400px canvas height
- Tablet: 300px canvas height  
- Mobile: 250px canvas height

## 🎨 Customization

You can customize the visualization by editing `visualizer.js`:

```javascript
this.waveCount = 5;           // Number of sine waves
this.waveSpeed = 0.05;        // Animation speed
this.baseAmplitude = 50;      // Base wave height
```

## 📄 License

Open source - feel free to use and modify!

## 👤 Author

Created by Iyari Gomez
(Blackmvmba88)
