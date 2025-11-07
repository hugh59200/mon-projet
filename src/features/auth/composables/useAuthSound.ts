// ✅ Hook audio compatible Chrome / Safari 2025
let ctx: AudioContext | null = null

function getContext() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function useAuthSound() {
  // 🔹 Initialise le contexte audio après un clic utilisateur
  if (typeof window !== 'undefined') {
    document.addEventListener(
      'click',
      () => {
        if (!ctx) getContext()
      },
      { once: true },
    )
  }

  const playTone = (frequency: number, duration = 0.3, type: OscillatorType = 'sine') => {
    try {
      const audio = getContext()
      const osc = audio.createOscillator()
      const gain = audio.createGain()

      osc.type = type
      osc.frequency.value = frequency
      gain.gain.value = 0.08 // volume doux

      osc.connect(gain)
      gain.connect(audio.destination)

      osc.start()
      osc.stop(audio.currentTime + duration)
    } catch (e) {
      console.warn('Audio playback failed:', e)
    }
  }

  const success = () => {
    playTone(523.25, 0.2, 'triangle') // Do
    setTimeout(() => playTone(659.25, 0.25, 'triangle'), 180) // Mi
  }

  const email = () => {
    playTone(659.25, 0.15, 'sine') // Mi
    setTimeout(() => playTone(783.99, 0.15, 'sine'), 120) // Sol
  }

  const error = () => {
    playTone(783.99, 0.2, 'sawtooth') // Sol
    setTimeout(() => playTone(659.25, 0.25, 'sawtooth'), 120) // Mi
  }

  return { success, email, error }
}
