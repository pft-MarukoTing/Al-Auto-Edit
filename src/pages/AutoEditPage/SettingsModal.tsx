import { useState } from 'react'
import icCredit from '../../assets/icons/ic_credit.svg'
import {
  DURATION_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  DURATION_SECONDS,
  LANGUAGE_OPTIONS,
  estimateGenerateCredits,
  type AutoEditSettings,
} from './autoEditData'
import './SettingsModal.css'

interface SettingsModalProps {
  initialSettings: AutoEditSettings
  materialSeconds: number
  voiceOverOn: boolean
  mediaCount: number
  onCancel: () => void
  onDone: (next: AutoEditSettings) => void
}

// Figma "Auto-Edit / Settings" (+ "/ Scroll Down") — see
// auto-edit-spec-main.md section 5. 500x600 modal, single sticky footer
// (the doc's own recommendation over the ambiguous duplicate-footer reading).
//
// Edits are held in a local draft and only committed to the parent on
// "Done" — confirmed live in the PM prototype that "Cancel" discards
// whatever was changed inside this modal (the left panel's summary chip
// only updates once Done is clicked).
function SettingsModal({ initialSettings, materialSeconds, voiceOverOn, mediaCount, onCancel, onDone }: SettingsModalProps) {
  const [draft, setDraft] = useState<AutoEditSettings>(initialSettings)
  const credits = estimateGenerateCredits(draft, mediaCount)

  function set<K extends keyof AutoEditSettings>(key: K, value: AutoEditSettings[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="ae-modal-overlay" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="ae-modal ae-modal--settings">
        <div className="ae-modal__heading-row">
          <h2 className="ae-modal__heading">Settings</h2>
          <span className="ae-modal__credit-pill">
            <img src={icCredit} alt="" />
            {credits}
          </span>
        </div>

        <div className="ae-modal__body settings-modal__body">
          <section className="settings-modal__section">
            <h3 className="settings-modal__label">Duration</h3>
            <div className="settings-modal__option-grid">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`settings-modal__option${draft.duration === option ? ' settings-modal__option--selected' : ''}`}
                  disabled={DURATION_SECONDS[option] > materialSeconds}
                  onClick={() => set('duration', option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="settings-modal__hint">
              Longer options need more footage - you have {formatSeconds(materialSeconds)}.
            </p>
          </section>

          <section className="settings-modal__section">
            <h3 className="settings-modal__label">Aspect ratio</h3>
            <div className="settings-modal__option-grid settings-modal__option-grid--3">
              {ASPECT_RATIO_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`settings-modal__option${draft.aspectRatio === option ? ' settings-modal__option--selected' : ''}`}
                  onClick={() => set('aspectRatio', option)}
                >
                  <span className={`settings-modal__ratio-swatch settings-modal__ratio-swatch--${option.replace(':', '-')}`} />
                  {option}
                </button>
              ))}
            </div>
            <p className="settings-modal__hint">
              Recommended 9:16 - from the first video in your order. Change it if you are publishing somewhere
              else.
            </p>
          </section>

          <ToggleRow
            label="Background Music"
            hint="AI automatically selects background music for you. You can adjust it afterward."
            checked={draft.backgroundMusic}
            onChange={(v) => set('backgroundMusic', v)}
          />
          <ToggleRow
            label="Smart Audio"
            hint="AI detects important original audio and prioritises it for a more authentic viewing experience."
            checked={draft.smartAudio}
            onChange={(v) => set('smartAudio', v)}
          />
          <ToggleRow
            label="Use Web Search"
            hint="Search online for relevant text information to enrich generated video content."
            checked={draft.webSearch}
            onChange={(v) => set('webSearch', v)}
          />
          <ToggleRow
            label="Add Motion to Photos"
            hint="Automatically add subtle pan and zoom effects to your photos."
            checked={draft.photoMotion}
            onChange={(v) => set('photoMotion', v)}
          />

          <section className={`settings-modal__section${voiceOverOn ? ' settings-modal__section--disabled' : ''}`}>
            <h3 className="settings-modal__label">Subtitle</h3>
            <div className="settings-modal__option-grid">
              {voiceOverOn ? (
                <button type="button" className="settings-modal__option settings-modal__option--selected" disabled>
                  {draft.subtitleLanguage}
                </button>
              ) : (
                <select
                  className="settings-modal__select"
                  value={draft.subtitleLanguage}
                  onChange={(event) => set('subtitleLanguage', event.target.value)}
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <p className="settings-modal__hint">
              Subtitle language matches the selected voice-over language. Turn Voice-Over off to choose a
              different subtitle language.
            </p>
          </section>
        </div>

        <div className="ae-modal__footer">
          <button type="button" className="ae-btn ae-btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="ae-btn ae-btn--primary" onClick={() => onDone(draft)}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <section className="settings-modal__section settings-modal__section--toggle">
      <div className="settings-modal__toggle-row">
        <h3 className="settings-modal__label">{label}</h3>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          className={`settings-modal__toggle${checked ? ' settings-modal__toggle--on' : ''}`}
          onClick={() => onChange(!checked)}
        >
          <span className="settings-modal__toggle-knob" />
        </button>
      </div>
      <p className="settings-modal__hint">{hint}</p>
    </section>
  )
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default SettingsModal
