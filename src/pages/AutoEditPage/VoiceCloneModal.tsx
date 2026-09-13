import { useEffect, useState } from 'react'
import icClose from '../../assets/icons/ic_close.svg'
import icChevronDown from '../../assets/icons/ic_chevron-down.svg'
import icRefresh from '../../assets/icons/ic_refresh.svg'
import icMic from '../../assets/icons/ic_singing_mic.svg'
import icSquare from '../../assets/icons/ic_square.svg'
import icPlay from '../../assets/icons/ic_play.svg'
import icCredit from '../../assets/icons/ic_credit.svg'
import AutoEditIcon from './AutoEditIcon'
import { LANGUAGE_OPTIONS } from './autoEditData'
import './VoiceCloneModal.css'

interface VoiceCloneModalProps {
  cloneCredits: number
  onCancel: () => void
  onComplete: () => void
}

type Step = 'entry' | 'recording' | 'preview' | 'generating'

const SAMPLE_SCRIPTS = [
  'I booked a last-minute flight with no plan, just vibes. Got lost, found amazing street food, chased the sunset, and remembered why I travel - not for photos, but the feeling.',
  'Some mornings deserve nothing more than good coffee, a quiet street, and no particular place to be. This was one of those mornings.',
  'We drove until the road ran out, pitched a tent by the water, and watched the sky turn every color it had. Best decision of the whole trip.',
]

// Figma "Auto-Edit / Voice Clone" + "/ Recording" + "/ Preview" + "/
// Generating" (see auto-edit-spec-voiceclone.md) — the full state machine for
// recording a custom voice. Renders as a second modal stacked on top of
// VoiceOverStyleModal, matching Figma's two-modals-over-a-dimmed-scrim frames.
function VoiceCloneModal({ cloneCredits, onCancel, onComplete }: VoiceCloneModalProps) {
  const [step, setStep] = useState<Step>('entry')
  const [language, setLanguage] = useState('English')
  const [scriptIndex, setScriptIndex] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (step !== 'recording') return
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [step])

  useEffect(() => {
    if (step !== 'generating') return
    setProgress(0)
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id)
          return 100
        }
        return p + 10
      })
    }, 250)
    return () => clearInterval(id)
  }, [step])

  useEffect(() => {
    if (step === 'generating' && progress >= 100) {
      const timeout = setTimeout(onComplete, 400)
      return () => clearTimeout(timeout)
    }
  }, [step, progress, onComplete])

  const locked = step === 'recording' || step === 'generating'
  const dimmed = step === 'generating'

  function formatTimer(total: number): string {
    const m = Math.floor(total / 60)
    const s = total % 60
    return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="ae-modal-overlay voice-clone-modal__overlay">
      <div className="ae-modal voice-clone-modal">
        <button type="button" className="ae-modal__close" aria-label="Close" onClick={onCancel} disabled={step === 'generating'}>
          <AutoEditIcon src={icClose} size={24} />
        </button>
        <div className="voice-clone-modal__heading-block">
          <h2 className="ae-modal__heading">Voice Clone</h2>
          <p className="voice-clone-modal__subtext">
            Read and record the sample text for <span className="voice-clone-modal__accent">10-15 seconds</span>
          </p>
        </div>

        <div className={`voice-clone-modal__body${dimmed ? ' voice-clone-modal__body--dimmed' : ''}`}>
          <div className={`voice-clone-modal__combobox${locked ? ' is-disabled' : ''}`}>
            <select value={language} disabled={locked} onChange={(event) => setLanguage(event.target.value)}>
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <AutoEditIcon src={icChevronDown} size={20} />
          </div>

          <div className="voice-clone-modal__script-block">
            <p className="voice-clone-modal__script-text">{SAMPLE_SCRIPTS[scriptIndex]}</p>
            <button
              type="button"
              className="voice-clone-modal__refresh-btn"
              disabled={locked}
              onClick={() => setScriptIndex((i) => (i + 1) % SAMPLE_SCRIPTS.length)}
            >
              <AutoEditIcon src={icRefresh} size={14} />
              Refresh
            </button>
          </div>

          <div className="voice-clone-modal__center">
            {step === 'entry' && (
              <>
                <button
                  type="button"
                  className="voice-clone-modal__record-btn voice-clone-modal__record-btn--idle"
                  onClick={() => {
                    setElapsedSeconds(0)
                    setStep('recording')
                  }}
                  aria-label="Start recording"
                >
                  <AutoEditIcon src={icMic} size={28} />
                </button>
                <span className="voice-clone-modal__center-label">Start recording</span>
              </>
            )}
            {step === 'recording' && (
              <>
                <button
                  type="button"
                  className="voice-clone-modal__record-btn voice-clone-modal__record-btn--recording"
                  onClick={() => setStep('preview')}
                  aria-label="Stop recording"
                >
                  <AutoEditIcon src={icSquare} size={24} />
                </button>
                <span className="voice-clone-modal__center-label">{formatTimer(elapsedSeconds)}</span>
              </>
            )}
            {step === 'preview' && (
              <>
                <button
                  type="button"
                  className="voice-clone-modal__record-btn voice-clone-modal__record-btn--preview"
                  aria-label="Play preview"
                >
                  <AutoEditIcon src={icPlay} size={28} />
                </button>
                <span className="voice-clone-modal__center-label">Preview</span>
              </>
            )}
            {step === 'generating' && (
              <>
                <span className="voice-clone-modal__spinner">{progress}%</span>
                <span className="voice-clone-modal__center-label">Voice Generating...</span>
              </>
            )}
          </div>
        </div>

        {(step === 'preview' || step === 'generating') && (
          <div className={`ae-modal__footer${step === 'generating' ? ' voice-clone-modal__footer--dimmed' : ''}`}>
            <button
              type="button"
              className="ae-btn ae-btn--brand-outline"
              disabled={step === 'generating'}
              onClick={() => setStep('recording')}
            >
              <AutoEditIcon src={icMic} size={18} />
              Record Again
            </button>
            <button
              type="button"
              className="ae-btn ae-btn--primary"
              disabled={step === 'generating'}
              onClick={() => setStep('generating')}
            >
              Clone
              <span className="ae-btn__credits">
                <img src={icCredit} alt="" />
                {cloneCredits}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VoiceCloneModal
