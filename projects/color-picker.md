# Color Picker

  An interactive color picker tool with RGB sliders and live preview.

  Touching or clicking the square color preview (..to the left of `#808080`) brings up your device's native color picker. It's probably the nicest option in most choices. 
## RGB Color Picker

<div class="color-picker-container">
  <div class="brightness-section">
    <div class="brightness-container">
      <label for="brightness-slider">Sat%:</label>
      <input type="range" id="brightness-slider" min="0" max="100" value="50">
      <span id="brightness-value">50</span>
    </div>
  </div>

  <div class="rgb-sliders">
    <div class="slider-group">
      <label for="red-slider">Red:</label>
      <input type="range" id="red-slider" min="0" max="255" value="128">
      <span id="red-value">128</span>
    </div>
    <div class="slider-group">
      <label for="green-slider">Green:</label>
      <input type="range" id="green-slider" min="0" max="255" value="128">
      <span id="green-value">128</span>
    </div>
    <div class="slider-group">
      <label for="blue-slider">Blue:</label>
      <input type="range" id="blue-slider" min="0" max="255" value="128">
      <span id="blue-value">128</span>
    </div>
  </div>

  <div class="color-display">
    <div class="color-preview-container">
      <input type="color" id="system-color-picker" value="#808080" class="color-preview-input">
      <div id="color-preview" class="color-preview-overlay"></div>
    </div>
    <div class="hex-input-container">
      <input type="text" id="hex-input" value="#808080" maxlength="7" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$">
      <button id="copy-hex-btn" class="copy-btn" type="button" title="Copy hex color">📋</button>
    </div>
  </div>


  <div id="copy-popup" class="copy-popup">
    <div class="copy-popup-content">
      <span class="copy-popup-icon">✅</span>
      <span class="copy-popup-text">Copied to clipboard!</span>
    </div>
  </div>

  <div class="color-picker-area">
    <div class="color-wheel-container">
      <canvas id="color-wheel-canvas" width="300" height="300"></canvas>
      <div class="color-cursor" id="color-cursor"></div>
    </div>
  </div>

  <div class="color-values-display">
    <div class="rgb-display">
      <span class="label">RGB:</span>
      <span class="values">
        <span id="rgb-red">128</span>,
        <span id="rgb-green">128</span>,
        <span id="rgb-blue">128</span>
      </span>
    </div>
    <div class="hsl-display">
      <span class="label">Hue:</span>
      <input type="text" id="hue-input" class="value-input" maxlength="4" placeholder="0">
      <span class="separator">|</span>
      <span class="label">Lum:</span>
      <input type="text" id="lum-input" class="value-input" maxlength="3" placeholder="50">
    </div>
  </div>
</div>

<script setup>
import { ref, onMounted } from 'vue'

const redValue = ref(128)
const greenValue = ref(128)
const blueValue = ref(128)
const hexCode = ref('#808080')


function updateColorFromSliders() {
  const rgbColor = `rgb(${redValue.value}, ${greenValue.value}, ${blueValue.value})`
  hexCode.value = rgbToHex(redValue.value, greenValue.value, blueValue.value)

  const colorPreview = document.getElementById('color-preview')
  if (colorPreview) {
    colorPreview.style.backgroundColor = rgbColor
  }

  const hexInput = document.getElementById('hex-input')
  if (hexInput) {
    hexInput.value = hexCode.value
  }

  const systemColorPicker = document.getElementById('system-color-picker')
  if (systemColorPicker) {
    systemColorPicker.value = hexCode.value
  }

  updateCursorFromRGB()
  updateColorValuesDisplay()
}


function updateSlidersFromColor(color) {
  const rgb = hexToRgb(color)

  if (rgb) {
    redValue.value = rgb.r
    greenValue.value = rgb.g
    blueValue.value = rgb.b

    const rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    hexCode.value = color

    const colorPreview = document.getElementById('color-preview')
    if (colorPreview) {
      colorPreview.style.backgroundColor = color
    }

    const hexInput = document.getElementById('hex-input')
    if (hexInput) {
      hexInput.value = color
    }

    const systemColorPicker = document.getElementById('system-color-picker')
    if (systemColorPicker) {
      systemColorPicker.value = color
    }

    const redSlider = document.getElementById('red-slider')
    const greenSlider = document.getElementById('green-slider')
    const blueSlider = document.getElementById('blue-slider')

    if (redSlider) redSlider.value = rgb.r
    if (greenSlider) greenSlider.value = rgb.g
    if (blueSlider) blueSlider.value = rgb.b

    updateCursorFromRGB()
    updateColorValuesDisplay()
  }
}

function updateColorFromHexInput() {
  const hexInput = document.getElementById('hex-input')
  if (!hexInput) return

  const hex = hexInput.value.trim()
  const rgb = hexToRgb(hex)

  if (rgb) {
    redValue.value = rgb.r
    greenValue.value = rgb.g
    blueValue.value = rgb.b
    hexCode.value = hex

    const colorPreview = document.getElementById('color-preview')
    if (colorPreview) {
      colorPreview.style.backgroundColor = hex
    }

    const redSlider = document.getElementById('red-slider')
    const greenSlider = document.getElementById('green-slider')
    const blueSlider = document.getElementById('blue-slider')

    if (redSlider) redSlider.value = rgb.r
    if (greenSlider) greenSlider.value = rgb.g
    if (blueSlider) blueSlider.value = rgb.b

    updateColorValuesDisplay()
  }
}


function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}


function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}


function updateFromColorWheel(rgb, hue, saturation) {
  redValue.value = rgb.r
  greenValue.value = rgb.g
  blueValue.value = rgb.b

  const rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  hexCode.value = rgbToHex(rgb.r, rgb.g, rgb.b)

  const colorPreview = document.getElementById('color-preview')
  if (colorPreview) {
    colorPreview.style.backgroundColor = rgbColor
  }

  const hexInput = document.getElementById('hex-input')
  if (hexInput) {
    hexInput.value = hexCode.value
  }

  const systemColorPicker = document.getElementById('system-color-picker')
  if (systemColorPicker) {
    systemColorPicker.value = hexCode.value
  }

  const redSlider = document.getElementById('red-slider')
  const greenSlider = document.getElementById('green-slider')
  const blueSlider = document.getElementById('blue-slider')

  if (redSlider) redSlider.value = rgb.r
  if (greenSlider) greenSlider.value = rgb.g
  if (blueSlider) blueSlider.value = rgb.b

  updateColorValuesDisplay()
}

function drawColorWheel(canvas, cursor) {
  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const imageData = ctx.createImageData(canvas.width, canvas.height)
  const data = imageData.data

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance <= radius) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI
        const hue = angle < 0 ? angle + 360 : angle
        const saturation = distance / radius

        const rgb = hslToRgb(hue / 360, saturation, 0.5)

        const index = (y * canvas.width + x) * 4
        data[index] = rgb.r
        data[index + 1] = rgb.g
        data[index + 2] = rgb.b
        data[index + 3] = 255   // Alpha
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)

  // Draw brightness slider background
  drawBrightnessSlider()

  // Handle mouse interactions for click and drag
  let isDragging = false

  function handleColorSelection(x, y) {
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= radius) {
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI
      const hue = angle < 0 ? angle + 360 : angle
      const saturation = Math.min(distance / radius, 1)

      currentHue = hue / 360
      currentSaturation = saturation

      const rgb = hslToRgb(currentHue, currentSaturation, currentLightness)
      updateFromColorWheel(rgb, hue, saturation)
    }
  }

  // Handle canvas clicks
  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    handleColorSelection(x, y)
  })

  // Handle mouse down for dragging
  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    isDragging = true
  })

  // Handle mouse move for dragging (document level to work everywhere)
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate mouse position relative to wheel center
      const dx = mouseX - centerX
      const dy = mouseY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      let cursorX, cursorY

      if (distance <= radius) {
        // Mouse is inside circle - cursor follows mouse exactly
        cursorX = mouseX
        cursorY = mouseY
      } else {
        // Mouse is outside circle - constrain cursor to edge
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI
        const radians = (angle * Math.PI) / 180
        cursorX = centerX + radius * Math.cos(radians)
        cursorY = centerY + radius * Math.sin(radians)
      }

      // Update cursor position
      cursor.style.left = (cursorX - 6) + 'px'
      cursor.style.top = (cursorY - 6) + 'px'
      cursor.style.display = 'block'

      const cursorDx = cursorX - centerX
      const cursorDy = cursorY - centerY
      const cursorDistance = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy)

      const angle = (Math.atan2(cursorDy, cursorDx) * 180) / Math.PI
      const hue = angle < 0 ? angle + 360 : angle
      const saturation = Math.min(cursorDistance / radius, 1)

      currentHue = hue / 360
      currentSaturation = saturation

      const rgb = hslToRgb(currentHue, currentSaturation, currentLightness)

      redValue.value = rgb.r
      greenValue.value = rgb.g
      blueValue.value = rgb.b
      hexCode.value = rgbToHex(rgb.r, rgb.g, rgb.b)

      const rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

      requestAnimationFrame(() => {
        const colorPreview = document.getElementById('color-preview')
        if (colorPreview) {
          colorPreview.style.backgroundColor = rgbColor
        }

        const hexInput = document.getElementById('hex-input')
        if (hexInput) {
          hexInput.value = hexCode.value
        }

        const systemColorPicker = document.getElementById('system-color-picker')
        if (systemColorPicker) {
          systemColorPicker.value = hexCode.value
        }

        const redSlider = document.getElementById('red-slider')
        const greenSlider = document.getElementById('green-slider')
        const blueSlider = document.getElementById('blue-slider')

        if (redSlider) redSlider.value = rgb.r
        if (greenSlider) greenSlider.value = rgb.g
        if (blueSlider) blueSlider.value = rgb.b

        // Update RGB and HSL displays in real-time during drag
        updateColorValuesDisplay()
      })
    }
  })

  // Handle mouse up to stop dragging (document level to work everywhere)
  document.addEventListener('mouseup', function() {
    isDragging = false
  })

  // Touch event handlers for mobile support
  let touchId = null

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault() // Prevent scrolling when touching the canvas
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    isDragging = true
    touchId = e.touches[0].identifier
  }, { passive: false })

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault() // Prevent scrolling when dragging
    if (!isDragging) return

    const rect = canvas.getBoundingClientRect()
    const touch = Array.from(e.touches).find(t => t.identifier === touchId)

    if (touch) {
      const touchX = touch.clientX - rect.left
      const touchY = touch.clientY - rect.top

      // Calculate touch position relative to wheel center
      const dx = touchX - centerX
      const dy = touchY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      let cursorX, cursorY

      if (distance <= radius) {
        // Touch is inside circle - cursor follows touch exactly
        cursorX = touchX
        cursorY = touchY
      } else {
        // Touch is outside circle - constrain cursor to edge
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI
        const radians = (angle * Math.PI) / 180
        cursorX = centerX + radius * Math.cos(radians)
        cursorY = centerY + radius * Math.sin(radians)
      }

      // Update cursor position
      cursor.style.left = (cursorX - 6) + 'px'
      cursor.style.top = (cursorY - 6) + 'px'
      cursor.style.display = 'block'

      const cursorDx = cursorX - centerX
      const cursorDy = cursorY - centerY
      const cursorDistance = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy)

      const angle = (Math.atan2(cursorDy, cursorDx) * 180) / Math.PI
      const hue = angle < 0 ? angle + 360 : angle
      const saturation = Math.min(cursorDistance / radius, 1)

      currentHue = hue / 360
      currentSaturation = saturation

      const rgb = hslToRgb(currentHue, currentSaturation, currentLightness)

      redValue.value = rgb.r
      greenValue.value = rgb.g
      blueValue.value = rgb.b
      hexCode.value = rgbToHex(rgb.r, rgb.g, rgb.b)

      const rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

      requestAnimationFrame(() => {
        const colorPreview = document.getElementById('color-preview')
        if (colorPreview) {
          colorPreview.style.backgroundColor = rgbColor
        }

        const hexInput = document.getElementById('hex-input')
        if (hexInput) {
          hexInput.value = hexCode.value
        }

        const systemColorPicker = document.getElementById('system-color-picker')
        if (systemColorPicker) {
          systemColorPicker.value = hexCode.value
        }

        const redSlider = document.getElementById('red-slider')
        const greenSlider = document.getElementById('green-slider')
        const blueSlider = document.getElementById('blue-slider')

        if (redSlider) redSlider.value = rgb.r
        if (greenSlider) greenSlider.value = rgb.g
        if (blueSlider) blueSlider.value = rgb.b

        // Update RGB and HSL displays in real-time during drag
        updateColorValuesDisplay()
      })
    }
  }, { passive: false })

  canvas.addEventListener('touchend', function(e) {
    e.preventDefault()
    isDragging = false
    touchId = null
  }, { passive: false })

  // Handle touch end for the entire document (in case touch ends outside canvas)
  document.addEventListener('touchend', function(e) {
    isDragging = false
    touchId = null
  }, { passive: true })

  // Handle mouse leave to stop dragging (only when not actively dragging)
  canvas.addEventListener('mouseleave', function() {
  })

  // Position cursor based on current color
  function updateCursorPosition() {
    const angle = currentHue * 360 * (Math.PI / 180) // Convert to radians
    const distance = currentSaturation * radius

    const cursorX = centerX + distance * Math.cos(angle)
    const cursorY = centerY + distance * Math.sin(angle)

    cursor.style.left = (cursorX - 6) + 'px'
    cursor.style.top = (cursorY - 6) + 'px'
    cursor.style.display = 'block'
  }

  canvas.addEventListener('mouseleave')

  // Initial cursor positioning
  updateCursorPosition()
}

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h, s, l }
}

function updateCursorFromRGB() {
  const hsl = rgbToHsl(redValue.value, greenValue.value, blueValue.value)
  currentHue = hsl.h
  currentSaturation = hsl.s
  currentLightness = hsl.l

  // Update cursor position if canvas exists
  const canvas = document.getElementById('color-wheel-canvas')
  const cursor = document.getElementById('color-cursor')

  if (canvas && cursor) {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY)

    const angle = currentHue * 360 * (Math.PI / 180)
    const distance = currentSaturation * radius

    const cursorX = centerX + distance * Math.cos(angle)
    const cursorY = centerY + distance * Math.sin(angle)

    cursor.style.left = (cursorX - 6) + 'px'
    cursor.style.top = (cursorY - 6) + 'px'
    cursor.style.display = 'block'
  }
}

function updateColorValuesDisplay() {
  // Update RGB display
  const rgbRed = document.getElementById('rgb-red')
  const rgbGreen = document.getElementById('rgb-green')
  const rgbBlue = document.getElementById('rgb-blue')

  if (rgbRed) rgbRed.textContent = redValue.value
  if (rgbGreen) rgbGreen.textContent = greenValue.value
  if (rgbBlue) rgbBlue.textContent = blueValue.value

  // Update HSL display
  const hsl = rgbToHsl(redValue.value, greenValue.value, blueValue.value)
  const hueInput = document.getElementById('hue-input')
  const lumInput = document.getElementById('lum-input')

  if (hueInput) {
    const hueValue = Math.round(hsl.h * 360)
    hueInput.value = hueValue.toString()
  }

  if (lumInput) {
    const lumValue = Math.round(hsl.l * 100)
    lumInput.value = lumValue.toString()
  }
}

// Current color state
let currentHue = 0.5
let currentSaturation = 0.5
let currentLightness = 0.5

function drawBrightnessSlider() {
  const slider = document.getElementById('brightness-slider')
  if (!slider) return

  const lightness = parseInt(slider.value) / 100
  currentLightness = lightness

  const lightColors = hslToRgb(currentHue, currentSaturation, 1)
  const darkColors = hslToRgb(currentHue, currentSaturation, 0)
  const currentColors = hslToRgb(currentHue, currentSaturation, lightness)

  redValue.value = currentColors.r
  greenValue.value = currentColors.g
  blueValue.value = currentColors.b

  const rgbColor = `rgb(${currentColors.r}, ${currentColors.g}, ${currentColors.b})`
  hexCode.value = rgbToHex(currentColors.r, currentColors.g, currentColors.b)

  const colorPreview = document.getElementById('color-preview')
  if (colorPreview) {
    colorPreview.style.backgroundColor = rgbColor
  }

  const hexInput = document.getElementById('hex-input')
  if (hexInput) {
    hexInput.value = hexCode.value
  }

  const brightnessValue = document.getElementById('brightness-value')
  if (brightnessValue) {
    brightnessValue.textContent = slider.value
  }

  const redSlider = document.getElementById('red-slider')
  const greenSlider = document.getElementById('green-slider')
  const blueSlider = document.getElementById('blue-slider')

  if (redSlider) redSlider.value = currentColors.r
  if (greenSlider) greenSlider.value = currentColors.g
  if (blueSlider) blueSlider.value = currentColors.b
}

function hslToRgb(h, s, l) {
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}


onMounted(() => {
  updateColorFromSliders()

  // Set up event listeners after component mounts
  setTimeout(() => {
    const redSlider = document.getElementById('red-slider')
    const greenSlider = document.getElementById('green-slider')
    const blueSlider = document.getElementById('blue-slider')
    const colorCanvas = document.getElementById('color-wheel-canvas')
    const colorCursor = document.getElementById('color-cursor')

    function addClickToJump(slider, callback) {
      slider.addEventListener('click', function(e) {
        // Only handle track clicks, not thumb clicks
        if (e.target === slider) {
          const rect = slider.getBoundingClientRect()
          const clickX = e.clientX - rect.left
          const percentage = clickX / rect.width
          const value = Math.round(percentage * (slider.max - slider.min)) + parseInt(slider.min)
          slider.value = Math.max(slider.min, Math.min(slider.max, value))
          callback()
        }
      })
    }

    if (redSlider) {
      redSlider.addEventListener('input', () => {
        redValue.value = parseInt(redSlider.value)
        updateColorFromSliders()
      })
      addClickToJump(redSlider, () => {
        redValue.value = parseInt(redSlider.value)
        updateColorFromSliders()
      })
    }

    if (greenSlider) {
      greenSlider.addEventListener('input', () => {
        greenValue.value = parseInt(greenSlider.value)
        updateColorFromSliders()
      })
      addClickToJump(greenSlider, () => {
        greenValue.value = parseInt(greenSlider.value)
        updateColorFromSliders()
      })
    }

    if (blueSlider) {
      blueSlider.addEventListener('input', () => {
        blueValue.value = parseInt(blueSlider.value)
        updateColorFromSliders()
      })
      addClickToJump(blueSlider, () => {
        blueValue.value = parseInt(blueSlider.value)
        updateColorFromSliders()
      })
    }

    const hexInput = document.getElementById('hex-input')
    if (hexInput) {
      hexInput.addEventListener('input', updateColorFromHexInput)
      hexInput.addEventListener('change', updateColorFromHexInput)
    }

    const brightnessSlider = document.getElementById('brightness-slider')
    if (brightnessSlider) {
      brightnessSlider.addEventListener('input', drawBrightnessSlider)
    }

    // Copy hex button functionality
    const copyHexBtn = document.getElementById('copy-hex-btn')
    if (copyHexBtn && hexInput) {
      copyHexBtn.addEventListener('click', async function(e) {
        e.preventDefault()
        e.stopPropagation()

        const hexValue = hexInput.value

        try {
          // Modern clipboard API
          await navigator.clipboard.writeText(hexValue)
          showCopyFeedback(copyHexBtn)
        } catch (err) {
          // Fallback for older browsers
          hexInput.select()
          document.execCommand('copy')
          showCopyFeedback(copyHexBtn)
        }
      })

      // Additional touch event handler for mobile
      copyHexBtn.addEventListener('touchend', async function(e) {
        e.preventDefault()
        e.stopPropagation()

        const hexValue = hexInput.value

        try {
          // Modern clipboard API
          await navigator.clipboard.writeText(hexValue)
          showCopyFeedback(copyHexBtn)
        } catch (err) {
          // Fallback for older browsers
          hexInput.select()
          document.execCommand('copy')
          showCopyFeedback(copyHexBtn)
        }
      }, { passive: false })
    }

    function showCopyFeedback(button) {
      // Add copied class to trigger CSS animation
      button.classList.add('copied')

      // Show popup notification
      const popup = document.getElementById('copy-popup')
      if (popup) {
        popup.classList.add('show')

        // Hide popup after 2.5 seconds
        setTimeout(() => {
          popup.classList.remove('show')
        }, 2500)
      }

      // Reset button after 1.5 seconds
      setTimeout(() => {
        button.classList.remove('copied')
      }, 1500)
    }

    const colorPreview = document.getElementById('color-preview')
    const systemColorPicker = document.getElementById('system-color-picker')
    if (colorPreview && systemColorPicker) {
      colorPreview.addEventListener('click', () => {
        systemColorPicker.click()
      })

      systemColorPicker.addEventListener('input', (e) => {
        const hex = e.target.value
        updateSlidersFromColor(hex)
      })

      systemColorPicker.addEventListener('change', (e) => {
        const hex = e.target.value
        updateSlidersFromColor(hex)
      })
    }
    if (colorCanvas && colorCursor) {
      drawColorWheel(colorCanvas, colorCursor)
    }
  }, 100)
})

</script>

<style>
  
.color-picker-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.rgb-sliders {
  margin-bottom: 20px;
}

.brightness-section {
  margin-bottom: 30px;
}

.brightness-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brightness-container label {
  min-width: 60px;
  font-weight: bold;
}

.brightness-container input[type="range"] {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #000000 0%, #808080 50%, #ffffff 100%);
  outline: none;
  -webkit-appearance: none;
}

.brightness-container input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 24px;
  border-radius: 3px;
  background: #fff;
  border: 2px solid #000;
  cursor: pointer;
}

.brightness-container input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 24px;
  border-radius: 3px;
  background: #fff;
  border: 2px solid #000;
  cursor: pointer;
}

.brightness-container span {
  min-width: 40px;
  text-align: right;
  font-family: monospace;
  font-weight: bold;
}

.slider-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.slider-group label {
  min-width: 60px;
  font-weight: bold;
}

.slider-group input[type="range"] {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
}

#red-slider {
  background: linear-gradient(to right, #000000 0%, #ff0000 100%);
}

#green-slider {
  background: linear-gradient(to right, #000000 0%, #00ff00 100%);
}

#blue-slider {
  background: linear-gradient(to right, #000000 0%, #0000ff 100%);
}

.slider-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 24px;
  border-radius: 3px;
  background: #fff;
  border: 2px solid #000;
  cursor: pointer;
}

.slider-group input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 24px;
  border-radius: 3px;
  background: #fff;
  border: 2px solid #000;
  cursor: pointer;
}

.slider-group span {
  min-width: 40px;
  text-align: right;
  font-family: monospace;
  font-weight: bold;
}

.color-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 0 auto 30px auto;
  width: 100%;
  max-width: 500px;
  position: relative;
}

.color-preview-container {
  position: relative;
  display: inline-block;
  contain: layout style;
}

.color-preview-input {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  box-sizing: border-box;
}

.color-preview-overlay {
  position: relative;
  width: 60px !important;
  height: 60px !important;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  display: inline-block;
}

.color-preview-overlay:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.color-preview-overlay:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

#hex-input {
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  padding: 10px 15px;
  background: #333;
  color: #fff;
  border-radius: 6px;
  border: 2px solid #555;
  width: 150px;
  text-align: center;
  outline: none;
}

#hex-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

#hex-input::selection {
  background: #4CAF50;
  color: #fff;
}

.hex-input-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  font-size: 18px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.copy-btn:hover {
  background: #45a049;
}

.copy-btn:active {
  background: #3d8b40;
}

.copy-btn.copied {
  background: #ff9800;
}

.copy-btn.copied::after {
  content: '✅';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: white;
  pointer-events: none;
}

/* Copy notification popup */
.copy-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 300px;
  text-align: center;
}

.copy-popup.show {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -50%) scale(1.05);
}

.copy-popup-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.copy-popup-icon {
  font-size: 24px;
  animation: bounce 0.6s ease-in-out;
}

.copy-popup-text {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

/* Mobile responsiveness for popup */
@media (max-width: 768px) {
  .copy-popup {
    padding: 16px 24px;
    max-width: 280px;
  }

  .copy-popup-icon {
    font-size: 20px;
  }

  .copy-popup-text {
    font-size: 16px;
  }
}

.color-picker-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.color-wheel-container {
  position: relative;
  display: inline-block;
}

#color-wheel-canvas {
  border-radius: 50%;
  cursor: crosshair;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border: 3px solid #ddd;
  image-rendering: smooth;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimize-contrast;
}

.color-cursor {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #000;
  box-shadow: 0 0 4px rgba(0,0,0,0.5);
  pointer-events: none;
  display: none;
  z-index: 10;
}

.color-values-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px auto 0 auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  max-width: 500px;
  gap: 40px;
}

.rgb-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hsl-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.label {
  font-weight: bold;
  font-size: 16px;
  color: #333;
  min-width: 40px;
}

.values {
  font-family: monospace;
  font-size: 16px;
  color: #000;
  font-weight: bold;
}

.value-input {
  font-family: monospace;
  font-size: 16px;
  font-weight: bold;
  width: 48px;
  padding: 4px 8px;
  border: 2px solid #ddd;
  border-radius: 4px;
  text-align: center;
  background: #fff;
  color: #000;
}

.value-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.separator {
  color: #666;
  font-weight: bold;
  margin: 0 5px;
}

/* Mobile responsiveness fixes */
@media (max-width: 768px) {
  .color-picker-container {
    max-width: 100% !important;
    margin: 0 auto;
    padding: 15px;
    box-sizing: border-box;
  }

  .color-display {
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }

  .color-preview-label {
    display: none;
  }

  .hex-input-container {
    gap: 6px;
  }

  .copy-btn {
    padding: 6px 10px;
    font-size: 16px;
  }

  .color-values-display {
    flex-direction: column;
    gap: 20px;
    align-items: center;
    text-align: center;
  }

  .rgb-display,
  .hsl-display {
    justify-content: center;
  }
}

/* Prevent horizontal overflow */
* {
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  max-width: 100%;
}

.color-picker-container {
  max-width: 100%;
  overflow-x: hidden;
}


</style>
