import icClose from '../../assets/icons/ic_close.svg'
import icChevronRight from '../../assets/icons/ic_chevron-right.svg'
import icCredit from '../../assets/icons/ic_credit.svg'
import AutoEditIcon from './AutoEditIcon'
import { STYLE_OPTIONS, voiceAvatar, type AutoEditSettings, type Voice } from './autoEditData'
import './AutoEditPanel.css'

interface AutoEditPanelProps {
  ideaText: string
  onIdeaTextChange: (value: string) => void
  onClearIdea: () => void
  selectedStyleId: string
  onSelectStyle: (id: string) => void
  voiceOverOn: boolean
  onVoiceOverToggle: (on: boolean) => void
  selectedVoice: Voice
  onOpenVoiceOver: () => void
  settings: AutoEditSettings
  onOpenSettings: () => void
  canGenerate: boolean
  generateCredits: number
  materialSeconds: number
  onGenerate: () => void
}

const IDEA_MAX = 2500

// Figma "Auto-Edit / Empty State" + "Ideal State" left panel (nodes
// 14442:170704 / 14458:246937) — see auto-edit-spec-main.md sections 1-2.
function AutoEditPanel({
  ideaText,
  onIdeaTextChange,
  onClearIdea,
  selectedStyleId,
  onSelectStyle,
  voiceOverOn,
  onVoiceOverToggle,
  selectedVoice,
  onOpenVoiceOver,
  settings,
  onOpenSettings,
  canGenerate,
  generateCredits,
  materialSeconds,
  onGenerate,
}: AutoEditPanelProps) {
  const settingsTags = [
    settings.duration,
    settings.aspectRatio,
    'Music',
    'Video Audio',
    'Web Search',
    'Photo Motion',
    settings.subtitleLanguage,
  ]
  // Figma's "set" values render as dark filled pills, "available but unset"
  // as outline pills — Background Music / Web Search / Photo Motion follow
  // each toggle's own on/off state; Duration/Aspect/Video Audio/English are
  // always "set".
  const settingsTagState: Record<string, boolean> = {
    [settings.duration]: true,
    [settings.aspectRatio]: true,
    Music: settings.backgroundMusic,
    'Video Audio': settings.smartAudio,
    'Web Search': settings.webSearch,
    'Photo Motion': settings.photoMotion,
    [settings.subtitleLanguage]: true,
  }

  const helperText = canGenerate
    ? `Generating costs ${generateCredits} credits.`
    : 'Add media and a description to continue'

  return (
    <div className="auto-edit-panel">
      <div className="auto-edit-panel__scroll">
        <section className="auto-edit-panel__section">
          <h2 className="auto-edit-panel__title">Describe Your Video Idea (Required)</h2>
          <div className="auto-edit-panel__textarea-wrap">
            <textarea
              className="auto-edit-panel__textarea"
              placeholder="Describe your video to help AI create a more compelling story."
              value={ideaText}
              maxLength={IDEA_MAX}
              onChange={(event) => onIdeaTextChange(event.target.value)}
            />
            <div className="auto-edit-panel__textarea-footer">
              <span>
                {ideaText.length}/{IDEA_MAX}
              </span>
              {ideaText.length > 0 && (
                <button
                  type="button"
                  className="auto-edit-panel__clear-btn"
                  aria-label="Clear"
                  onClick={onClearIdea}
                >
                  <AutoEditIcon src={icClose} size={12} />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="auto-edit-panel__section">
          <h2 className="auto-edit-panel__title">Select Style</h2>
          <div className="auto-edit-panel__style-row">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style.id}
                type="button"
                className={`auto-edit-panel__style${style.id === selectedStyleId ? ' auto-edit-panel__style--selected' : ''}`}
                onClick={() => onSelectStyle(style.id)}
              >
                <span className="auto-edit-panel__style-thumb">
                  <img src={style.thumbnail} alt="" />
                </span>
                <span className="auto-edit-panel__style-label">{style.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="auto-edit-panel__section">
          <div className="auto-edit-panel__row-header">
            <h2 className="auto-edit-panel__title">Voice-Over</h2>
            <div className="auto-edit-panel__toggle-group">
              <span className={!voiceOverOn ? 'is-active' : ''}>OFF</span>
              <button
                type="button"
                role="switch"
                aria-checked={voiceOverOn}
                className={`auto-edit-panel__toggle${voiceOverOn ? ' auto-edit-panel__toggle--on' : ''}`}
                onClick={() => onVoiceOverToggle(!voiceOverOn)}
              >
                <span className="auto-edit-panel__toggle-knob" />
              </button>
              <span className={voiceOverOn ? 'is-active' : ''}>ON</span>
            </div>
          </div>
          {/* Confirmed live in the PM prototype: switching Voice-Over OFF
              removes this row entirely (not just a disabled/grayed state) —
              Settings moves up to fill the gap. */}
          {voiceOverOn && (
            <button type="button" className="auto-edit-panel__preset-row" onClick={onOpenVoiceOver}>
              <img src={voiceAvatar} alt="" className="auto-edit-panel__preset-avatar" />
              <span className="auto-edit-panel__preset-info">
                <span className="auto-edit-panel__preset-name">{selectedVoice.name}</span>
                <span className="auto-edit-panel__preset-tags">
                  <span className="auto-edit-panel__preset-tag">{selectedVoice.language}</span>
                  <span className="auto-edit-panel__preset-tag auto-edit-panel__preset-tag--outline">
                    {selectedVoice.tag}
                  </span>
                </span>
              </span>
              <AutoEditIcon src={icChevronRight} size={16} />
            </button>
          )}
        </section>

        <section className="auto-edit-panel__section">
          <h2 className="auto-edit-panel__title">Settings</h2>
          <button type="button" className="auto-edit-panel__preset-row auto-edit-panel__preset-row--settings" onClick={onOpenSettings}>
            <span className="auto-edit-panel__settings-tags">
              {settingsTags.map((tag) => (
                <span
                  key={tag}
                  className={`auto-edit-panel__tag${settingsTagState[tag] ? ' auto-edit-panel__tag--set' : ''}`}
                >
                  {tag}
                </span>
              ))}
            </span>
            <AutoEditIcon src={icChevronRight} size={16} />
          </button>
          {settings.duration && (
            <p className="auto-edit-panel__hint">
              Longer options need more footage - you have {formatSeconds(materialSeconds)}.
            </p>
          )}
        </section>
      </div>

      <div className="auto-edit-panel__footer">
        <button
          type="button"
          className={`auto-edit-panel__generate${canGenerate ? ' auto-edit-panel__generate--enabled' : ''}`}
          disabled={!canGenerate}
          onClick={onGenerate}
        >
          Generate
          <span className="auto-edit-panel__generate-credits">
            <img src={icCredit} alt="" />
            {generateCredits}
          </span>
        </button>
        <p className="auto-edit-panel__footer-hint">{helperText}</p>
      </div>
    </div>
  )
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default AutoEditPanel
