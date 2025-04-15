import * as GOVUKFrontend from 'govuk-frontend'
import * as MOJFrontend from '@ministryofjustice/frontend'

GOVUKFrontend.initAll()
MOJFrontend.initAll()

function togglePasswordVisibility(passwordFieldId, toggleButtonElement) {
  const passwordField = document.getElementById(passwordFieldId)
  const isPasswordVisible = passwordField.type === 'text'
  passwordField.type = isPasswordVisible ? 'password' : 'text'

  const newTextContent = isPasswordVisible ? 'Show' : 'Hide'
  const ariaLabel = isPasswordVisible ? 'Show password' : 'Hide password'

  const updatedToggleButton = toggleButtonElement
  updatedToggleButton.textContent = newTextContent
  updatedToggleButton.setAttribute('aria-label', ariaLabel)
}

document.querySelectorAll('.govuk-show-password__toggle').forEach(button => {
  button.addEventListener('click', function handlePasswordToggle() {
    const passwordFieldId = this.getAttribute('aria-controls')
    togglePasswordVisibility(passwordFieldId, this)
  })
})

// open camera and process photo
document.addEventListener('DOMContentLoaded', () => {
  async function openCamera() {
    const videoContainer = document.getElementById('video-container')

    if (videoContainer) {
      try {
        const video = document.createElement('video')
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const constraints = { video: true }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        video.srcObject = stream
        video.play()

        videoContainer.appendChild(video)

        const takePhotoButton = document.getElementById('take-photo')
        if (takePhotoButton) {
          takePhotoButton.addEventListener('click', async () => {
            canvas.width = 400
            canvas.height = 300
            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            const dataUrl = canvas.toDataURL('image/jpeg', 0.9)

            const img = document.createElement('img')
            img.src = dataUrl
            img.style.width = '100%'
            img.style.height = '100%'
            img.style.objectFit = 'cover'
            videoContainer.innerHTML = ''
            videoContainer.appendChild(img)

            stream.getTracks().forEach(track => track.stop())

            const csrfTokenElement = document.querySelector('input[name="_csrf"]')
            if (!csrfTokenElement) {
              window.location.href = '/pop/verify/take-photo'
              return
            }
            const csrfToken = csrfTokenElement.value

            try {
              const response = await fetch('/pop/verify/save-photo', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ _csrf: csrfToken, photo: dataUrl }),
              })

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
              }
              const data = await response.json()
              if (data.success) {
                window.location.href = '/pop/verify/display-photo'
              } else {
                window.location.href = '/pop/verify/take-photo'
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('Error saving photo: ', err)
              window.location.href = '/pop/verify/take-photo'
            }
          })
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error accessing camera: ', err)
      }
    }
  }
  const { pathname } = window.location

  if (pathname === '/pop/verify/take-photo') {
    openCamera()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video')
  const startRecordButton = document.getElementById('start-recording')
  const stopRecordButton = document.getElementById('stop-recording')

  let mediaRecorder
  let recordedChunks = []

  async function startVideoStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      video.srcObject = stream
      video.muted = true

      mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' })

        const formData = new FormData()
        formData.append('video', blob, 'recorded-video.webm')

        try {
          const response = await fetch('/pop/save-checkin-video', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            console.error('Error uploading video', response) // eslint-disable-line no-console
            return
          }

          const data = await response.json()
          if (data.success) {
            window.location.href = '/pop/video-checkIn?uploaded=success'
          } else {
            console.error('Error uploading video') // eslint-disable-line no-console
          }
        } catch (error) {
          console.error('Error submitting video:', error) // eslint-disable-line no-console
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error) // eslint-disable-line no-console
    }
  }

  startRecordButton.addEventListener('click', () => {
    recordedChunks = []
    mediaRecorder.start()
    startRecordButton.disabled = true
    stopRecordButton.disabled = false
  })

  stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop()
    startRecordButton.disabled = false
    stopRecordButton.disabled = true
  })

  startVideoStream()
})
