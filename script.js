

// --- Team Modal ---
const aboutUsBtn = document.getElementById('aboutUsBtn');
const teamModal = document.getElementById('teamModal');
const closeTeamModal = document.getElementById('closeTeamModal');
const closeTeamModalBtn = document.getElementById('closeTeamModalBtn');

aboutUsBtn.addEventListener('click', () => teamModal.classList.remove('hidden'));
closeTeamModal.addEventListener('click', () => teamModal.classList.add('hidden'));
closeTeamModalBtn.addEventListener('click', () => teamModal.classList.add('hidden'));
teamModal.addEventListener('click', e => { if (e.target === teamModal) teamModal.classList.add('hidden'); });

// --- Settings Modal ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');

settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
closeSettingsModal.addEventListener('click', () => settingsModal.classList.add('hidden'));
closeSettingsModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
settingsModal.addEventListener('click', e => { if (e.target === settingsModal) settingsModal.classList.add('hidden'); });

// --- Gesture Guide Modal ---
const gestureGuideBtn = document.getElementById('gestureGuideBtn');
const gestureGuideModal = document.getElementById('gestureGuideModal');
const closeGestureGuideModal = document.getElementById('closeGestureGuideModal');
const closeGestureGuideModalBtn = document.getElementById('closeGestureGuideModalBtn');

gestureGuideBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden'); // Close settings first
  gestureGuideModal.classList.remove('hidden');
});
closeGestureGuideModal.addEventListener('click', () => gestureGuideModal.classList.add('hidden'));
closeGestureGuideModalBtn.addEventListener('click', () => gestureGuideModal.classList.add('hidden'));
gestureGuideModal.addEventListener('click', e => { if (e.target === gestureGuideModal) gestureGuideModal.classList.add('hidden'); });

// --- Features Modal ---
const featuresBtn = document.getElementById('featuresBtn');
const featuresModal = document.getElementById('featuresModal');
const closeFeaturesModal = document.getElementById('closeFeaturesModal');
const closeFeaturesModalBtn = document.getElementById('closeFeaturesModalBtn');

featuresBtn.addEventListener('click', () => {
  settingsModal.classList.add('hidden'); // Close settings first
  featuresModal.classList.remove('hidden');
});
closeFeaturesModal.addEventListener('click', () => featuresModal.classList.add('hidden'));
closeFeaturesModalBtn.addEventListener('click', () => featuresModal.classList.add('hidden'));
featuresModal.addEventListener('click', e => { if (e.target === featuresModal) featuresModal.classList.add('hidden'); });

// --- Save Settings Functionality ---
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const sensitivitySelect = document.getElementById('sensitivitySelect');
const qualitySelect = document.getElementById('qualitySelect');
const mirrorToggle = document.getElementById('mirrorToggle');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const soundToggle = document.getElementById('soundToggle');

// Apply mirror setting function
const applyMirrorSetting = () => {
  const mirrorEnabled = mirrorToggle ? mirrorToggle.checked : true; // Default to true
  
  if (mirrorEnabled) {
    cameraCanvas.style.transform = 'scaleX(-1)';
  } else {
    cameraCanvas.style.transform = 'scaleX(1)';
  }
};

// Load saved settings on page load
const loadSettings = () => {
  const settings = JSON.parse(localStorage.getItem('gestureTextSettings') || '{}');
  
  if (settings.sensitivity) sensitivitySelect.value = settings.sensitivity;
  if (settings.quality) qualitySelect.value = settings.quality;
  if (settings.mirror !== undefined) mirrorToggle.checked = settings.mirror;
  if (settings.autoSave !== undefined) autoSaveToggle.checked = settings.autoSave;
  if (settings.sound !== undefined) soundToggle.checked = settings.sound;
  
  // Apply mirror setting
  applyMirrorSetting();
};

// Save settings function
const saveSettings = () => {
  const settings = {
    sensitivity: parseFloat(sensitivitySelect.value),
    quality: parseInt(qualitySelect.value),
    mirror: mirrorToggle.checked,
    autoSave: autoSaveToggle.checked,
    sound: soundToggle.checked,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('gestureTextSettings', JSON.stringify(settings));
  
  // Apply settings immediately
  if (hands) {
    hands.setOptions({
      maxNumHands: 4,
      modelComplexity: 1,
      minDetectionConfidence: settings.sensitivity,
      minTrackingConfidence: settings.sensitivity
    });
  }
  
  // Apply mirror setting
  applyMirrorSetting();
  
  // Show success feedback
  const originalText = saveSettingsBtn.innerHTML;
  saveSettingsBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Settings Saved!';
  saveSettingsBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  
  // Play success sound if enabled
  if (settings.sound) {
    playNotificationSound('success');
  }
  
  setTimeout(() => {
    saveSettingsBtn.innerHTML = originalText;
    saveSettingsBtn.style.background = '';
    settingsModal.classList.add('hidden');
  }, 1500);
};

// Sound feedback function
const playNotificationSound = (type) => {
  if (!soundToggle.checked) return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'success') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }
};

// Auto-save text function
const autoSaveText = (text) => {
  if (!autoSaveToggle.checked || !text || text === 'Recognized text will appear here...') return;
  
  const savedTexts = JSON.parse(localStorage.getItem('gestureTextHistory') || '[]');
  savedTexts.unshift({
    text: text,
    timestamp: new Date().toISOString(),
    id: Date.now()
  });
  
  // Keep only last 50 entries
  if (savedTexts.length > 50) {
    savedTexts.splice(50);
  }
  
  localStorage.setItem('gestureTextHistory', JSON.stringify(savedTexts));
};

// Event listeners
saveSettingsBtn.addEventListener('click', saveSettings);

// Real-time mirror toggle
mirrorToggle.addEventListener('change', applyMirrorSetting);

// Load settings on page load
window.addEventListener('DOMContentLoaded', loadSettings);

// --- Dark Mode ---
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;
if (localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}
darkModeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.setItem('darkMode', html.classList.contains('dark'));
});

// --- Camera Simulation ---
const startCameraBtn = document.getElementById('startCameraBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const toggleCameraBtn = document.getElementById('toggleCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const cameraView = document.getElementById('cameraView');
const cameraCanvas = document.getElementById('cameraCanvas');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const outputText = document.getElementById('outputText');
const copyTextBtn = document.getElementById('copyTextBtn');
const clearTextBtn = document.getElementById('clearTextBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

const sampleOutputs = [
  "Hello, how are you?",
  "Thank you for using GestureText",
  "This is a demonstration of real-time gesture recognition",
  "The quick brown fox jumps over the lazy dog",
  "Gesture recognition technology is transforming communication"
];

let recognitionInterval;

startCameraBtn.addEventListener('click', async () => {
  try {
    // Update status immediately
    statusIndicator.classList.replace('bg-gray-400', 'bg-yellow-400');
    statusText.textContent = "Initializing camera...";
    
    if (!camera) {
      // Set up camera with optimized settings for faster initialization
      camera = new Camera(cameraView, {
        onFrame: async () => {
          await hands.send({ image: cameraView });
        },
        width: 1280,  // Reduced for faster startup
        height: 720,  // 720p for better performance
        facingMode: "user"
      });
      
      // Pre-configure video element for immediate display
      cameraView.setAttribute('playsinline', 'true');
      cameraView.setAttribute('autoplay', 'true');
      cameraView.style.filter = 'brightness(1.05) contrast(1.05)';
      
      // Add event listeners for video loading states
      cameraView.addEventListener('loadstart', () => {
        statusText.textContent = "Loading camera feed...";
      });
      
      cameraView.addEventListener('loadedmetadata', () => {
        statusText.textContent = "Camera feed ready";
      });
      
      cameraView.addEventListener('canplay', () => {
        // Ensure canvas is properly sized when video is ready
        cameraCanvas.width = cameraView.videoWidth || 1280;
        cameraCanvas.height = cameraView.videoHeight || 720;
        statusIndicator.classList.replace('bg-yellow-400', 'bg-green-400');
        statusText.textContent = "Camera active - Hand tracking enabled";
      });
    }
    
    // Start camera with timeout handling
    const startPromise = camera.start();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Camera startup timeout')), 10000)
    );
    
    await Promise.race([startPromise, timeoutPromise]);
    
    // Show canvas only (not video) and controls
    cameraPlaceholder.classList.add('hidden');
    cameraCanvas.classList.remove('hidden'); // Only show canvas with gesture overlay
    startCameraBtn.classList.add('hidden');
    stopCameraBtn.classList.remove('hidden');
    toggleCameraBtn.classList.remove('hidden');
    captureBtn.classList.remove('hidden');

    // Apply current mirror setting
    applyMirrorSetting();

    // Update status
    statusIndicator.classList.replace('bg-yellow-400', 'bg-green-400');
    statusText.textContent = "Camera active - Hand tracking enabled";
  } catch (err) {
    console.error("Error accessing camera:", err);
    statusText.textContent = "Camera access denied";
  }
});

stopCameraBtn.addEventListener('click', () => {
  // Stop the camera
  if (camera) {
    camera.stop();
  }

  // Reset UI
  cameraPlaceholder.classList.remove('hidden');
  cameraCanvas.classList.add('hidden'); // Only hide canvas
  startCameraBtn.classList.remove('hidden');
  stopCameraBtn.classList.add('hidden');
  toggleCameraBtn.classList.add('hidden');
  captureBtn.classList.add('hidden');

  // Update status
  statusIndicator.classList.replace('bg-green-400', 'bg-gray-400');
  statusText.textContent = "Camera stopped";
});

// Track current camera facing mode
let currentFacingMode = 'user'; // Start with front camera

toggleCameraBtn.addEventListener('click', async () => {
  try {
    // Switch facing mode
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    // Stop current camera
    if (camera) {
      await camera.stop();
    }

    // Start new camera with switched facing mode
    camera = new Camera(cameraView, {
      onFrame: async () => {
        await hands.send({ image: cameraView });
      },
      width: 1920,
      height: 1080,
      facingMode: currentFacingMode
    });
    
    await camera.start();
    
    // Update button text to indicate current camera
    toggleCameraBtn.innerHTML = `<i class="fas fa-sync-alt mr-1"></i>${currentFacingMode === 'user' ? 'Front' : 'Back'} Camera`;
    
  } catch (error) {
    console.error('Error switching camera:', error);
    statusText.textContent = "Error switching camera";
  }
});

captureBtn.addEventListener('click', () => {
  try {
    // Create a temporary canvas for high-quality capture
    const captureCanvas = document.createElement('canvas');
    captureCanvas.width = cameraCanvas.width;
    captureCanvas.height = cameraCanvas.height;
    const captureCtx = captureCanvas.getContext('2d');

    // Apply mirror effect to match the display
    captureCtx.scale(-1, 1);
    captureCtx.translate(-captureCanvas.width, 0);
    
    // Copy the current canvas content (with hand tracking visualization)
    captureCtx.drawImage(cameraCanvas, 0, 0);

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.download = `gesture-capture-${new Date().toISOString().slice(0,19).replace(/[:-]/g, '')}.png`;
    
    // Convert to blob and create URL
    captureCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.click();
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png', 1.0); // Use maximum quality

    // Visual feedback
    const originalText = captureBtn.innerHTML;
    captureBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Captured!';
    setTimeout(() => {
      captureBtn.innerHTML = originalText;
    }, 1500);

  } catch (error) {
    console.error('Error capturing image:', error);
    statusText.textContent = "Error capturing image";
  }
});

copyTextBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(outputText.textContent).then(() => {
    const originalText = copyTextBtn.innerHTML;
    copyTextBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
    setTimeout(() => { copyTextBtn.innerHTML = originalText; }, 2000);
  });
});

clearTextBtn.addEventListener('click', () => { outputText.textContent = ""; });

window.addEventListener('resize', () => {
  // Future responsive adjustments can go here
});
// --- Mediapipe Hands Integration ---

// Setup Mediapipe Hands with highest quality settings
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

// Hands configuration with maximum quality
hands.setOptions({
  maxNumHands: 4,          // Detect up to 4 hands
  modelComplexity: 1,      // Use full model (highest quality)
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});

const ctx = cameraCanvas.getContext("2d");

// When hands are detected
hands.onResults((results) => {
  // Set canvas size to match video resolution for better quality
  if (cameraCanvas.width !== results.image.width) {
    cameraCanvas.width = results.image.width;
    cameraCanvas.height = results.image.height;
  }

  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Clear previous frame
  ctx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);

  // Draw the video frame with proper scaling
  ctx.drawImage(results.image, 0, 0, cameraCanvas.width, cameraCanvas.height);

  // Draw detected hand landmarks with enhanced visibility
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      // Draw connections with sharp, clear lines
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00ff00';
      ctx.fillStyle = '#00ff00';
      
      // Draw connections with custom style for better visibility
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: "#22c55e", // More visible green
        lineWidth: 3
      });
      
      // Draw landmarks as clear, sharp points
      for (const landmark of landmarks) {
        const x = landmark.x * cameraCanvas.width;
        const y = landmark.y * cameraCanvas.height;
        
        // Outer circle (glow effect)
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)'; // Semi-transparent red
        ctx.fill();
        
        // Inner circle (sharp point)
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444'; // Solid red
        ctx.fill();
        
        // White center for better visibility
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    }
    // --- Simple gesture demo (5 gestures) ---
    // This block is intentionally self-contained and only updates #outputText for demonstration.
    try {
      const labels = [];
      const diag = Math.hypot(cameraCanvas.width, cameraCanvas.height) || 1;

      // helper: euclidean distance in pixels
      const pxDist = (a, b) => {
        const dx = (a.x - b.x) * cameraCanvas.width;
        const dy = (a.y - b.y) * cameraCanvas.height;
        return Math.hypot(dx, dy);
      };

      // For each detected hand, compute a simple finger-extended boolean set
      for (let h = 0; h < results.multiHandLandmarks.length; ++h) {
        const lm = results.multiHandLandmarks[h];

        // Simple vertical test for fingers (tip above pip -> extended)
        const isExtended = (tip, pip) => lm[tip].y < lm[pip].y;

        const thumbExtended = (function () {
          // Heuristic: thumb is extended if tip is a noticeable distance from wrist
          // and the tip is above the thumb IP (simple orientation check)
          const tip = lm[4];
          const ip = lm[3];
          const wrist = lm[0];
          const d = pxDist(tip, wrist);
          return (d > diag * 0.06) && (tip.y < ip.y + 0.02);
        })();

        const indexExtended = isExtended(8, 6);
        const middleExtended = isExtended(12, 10);
        const ringExtended = isExtended(16, 14);
        const pinkyExtended = isExtended(20, 18);

        const allExtended = thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended;
        const allFolded = !thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended;

        // Classifiers (simple, rule-based)
        const isHello = allExtended; // open palm
        const isFist = allFolded; // fist
        const isPoint = indexExtended && !middleExtended && !ringExtended && !pinkyExtended; // single index
        const isVictory = indexExtended && middleExtended && !ringExtended && !pinkyExtended; // V sign
        const isThumbsUp = thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended && (lm[4].y < lm[0].y);

        if (isHello) labels.push('Hello (Open Palm)');
        else if (isThumbsUp) labels.push('Thumbs Up');
        else if (isFist) labels.push('Fist');
        else if (isPoint) labels.push('Point');
        else if (isVictory) labels.push('Victory (V)');
        else labels.push('');
      }

      // Filter empty labels and show results
      const visible = labels.filter(l => l.length > 0);
      if (visible.length > 0) {
        const newText = visible.join(' | ');
        outputText.textContent = newText;
        
        // Auto-save if enabled
        autoSaveText(newText);
        
        // Play sound feedback if enabled
        if (soundToggle && soundToggle.checked) {
          playNotificationSound('success');
        }
      } else {
        // Keep default placeholder when nothing recognized
        outputText.textContent = 'Recognized text will appear here...';
      }
    } catch (e) {
      // Don't break the main pipeline if something in demo code fails
      console.warn('Gesture demo error:', e);
    }
  }
});

// Use Mediapipe's Camera helper to connect video -> Hands
let camera;

// Camera initialization is handled above in the main startCameraBtn event listener

