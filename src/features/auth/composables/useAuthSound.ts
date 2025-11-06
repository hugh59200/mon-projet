// Petit hook pour générer des sons avec Web Audio API
export function useAuthSound() {
  const playTone = (frequency: number, duration = 0.3, type: OscillatorType = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.value = frequency
      gain.gain.value = 0.08 // volume doux

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)

      // auto-close
      osc.onended = () => ctx.close()
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
