import { useState } from 'react'
import icClose from '../../assets/icons/ic_close.svg'
import icChevronDown from '../../assets/icons/ic_chevron-down.svg'
import icFilter from '../../assets/auto-edit/icons/funnel.svg'
import icPlay from '../../assets/icons/ic_play.svg'
import icPause from '../../assets/icons/ic_pause.svg'
import icDelete from '../../assets/icons/ic_delete.svg'
import icUpload from '../../assets/icons/ic_upload.svg'
import icMic from '../../assets/icons/ic_singing_mic.svg'
import icCredit from '../../assets/icons/ic_credit.svg'
import AutoEditIcon from './AutoEditIcon'
import VoiceCloneModal from './VoiceCloneModal'
import {
  SAMPLE_VOICES,
  LANGUAGE_OPTIONS,
  TAG_COLORS,
  voiceAvatar,
  myVoicesEmptyIllustration,
  type Voice,
} from './autoEditData'
import './VoiceOverStyleModal.css'

interface VoiceOverStyleModalProps {
  selectedVoiceId: string
  myVoices: Voice[]
  onSelectVoice: (voice: Voice) => void
  onAddMyVoice: (voice: Voice, creditsSpent: number) => void
  onDeleteMyVoice: (voiceId: string) => void
  onClose: () => void
}

type Tab = 'Sample Voices' | 'My Voices'
type GenderFilter = 'All' | 'Male' | 'Female'
type StyleFilter = 'All' | 'Neutral' | 'Friendly' | 'Cheerful' | 'Serious'

const RECORD_CLONE_CREDITS = 50 // per live-prototype behavior (see auto-edit-spec-voiceclone.md §4/§9)
const IMPORT_CLONE_CREDITS = 30 // per Figma redline (no conflicting live data for this specific path)

// Figma "Auto-Edit / Voice-Over Style" and its Record/Import/Delete sub-flows
// — see auto-edit-spec-voiceover.md. Handles all 7 frames from that doc as
// one component: tab switching, filter popover, My Voices empty/populated
// states, and the Import-preview / Delete-confirm sub-dialogs. The Record
// sub-flow (Voice Clone entry/recording/preview/generating) is delegated to
// <VoiceCloneModal>, stacked on top per Figma's two-modals-at-once pattern.
function VoiceOverStyleModal({
  selectedVoiceId,
  myVoices,
  onSelectVoice,
  onAddMyVoice,
  onDeleteMyVoice,
  onClose,
}: VoiceOverStyleModalProps) {
  const [tab, setTab] = useState<Tab>('Sample Voices')
  const [language, setLanguage] = useState('English')
  const [filterOpen, setFilterOpen] = useState(false)
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('All')
  const [styleFilter, setStyleFilter] = useState<StyleFilter>('All')
  const [activeMyVoiceId, setActiveMyVoiceId] = useState<string | null>(null)
  const [importPreviewOpen, setImportPreviewOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Voice | null>(null)
  const [recordFlowOpen, setRecordFlowOpen] = useState(false)

  const filteredSampleVoices = SAMPLE_VOICES.filter((voice) => {
    if (genderFilter !== 'All' && voice.gender !== genderFilter) return false
    if (styleFilter !== 'All' && voice.tag !== styleFilter) return false
    return true
  })

  function handleUse(voice: Voice) {
    onSelectVoice(voice)
    onClose()
  }

  function handleImportClick() {
    // No real OS file picker in this prototype (mock data only) — clicking
    // Import goes straight to the preview dialog Figma shows post-pick.
    setImportPreviewOpen(true)
  }

  function handleImportClone() {
    const voice: Voice = {
      id: `my-voice-${myVoices.length + 1}`,
      name: `My Voice ${myVoices.length + 1}`,
      language: 'English',
      tag: 'Neutral',
      gender: 'Female',
      isCustom: true,
    }
    onAddMyVoice(voice, IMPORT_CLONE_CREDITS)
    setImportPreviewOpen(false)
  }

  function handleRecordClone() {
    const voice: Voice = {
      id: `my-voice-${myVoices.length + 1}`,
      name: `My Voice ${myVoices.length + 1}`,
      language: 'English',
      tag: 'Neutral',
      gender: 'Female',
      isCustom: true,
    }
    onAddMyVoice(voice, RECORD_CLONE_CREDITS)
    setRecordFlowOpen(false)
  }

  return (
    <div className="ae-modal-overlay" role="dialog" aria-modal="true" aria-label="Voice-Over Style">
      <div className="ae-modal voice-over-modal">
        <button type="button" className="ae-modal__close" aria-label="Close" onClick={onClose}>
          <AutoEditIcon src={icClose} size={24} />
        </button>
        <div className="ae-modal__heading-row">
          <h2 className="ae-modal__heading">Voice-Over Style</h2>
        </div>

        <div className="voice-over-modal__tabs">
          <button
            type="button"
            className={`voice-over-modal__tab${tab === 'Sample Voices' ? ' voice-over-modal__tab--active' : ''}`}
            onClick={() => setTab('Sample Voices')}
          >
            Sample Voices
          </button>
          <button
            type="button"
            className={`voice-over-modal__tab${tab === 'My Voices' ? ' voice-over-modal__tab--active' : ''}`}
            onClick={() => setTab('My Voices')}
          >
            My Voices
          </button>
        </div>

        <div className="ae-modal__body voice-over-modal__body">
          {tab === 'Sample Voices' ? (
            <>
              <div className="voice-over-modal__filter-row">
                <div className="voice-over-modal__combobox">
                  <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <AutoEditIcon src={icChevronDown} size={20} />
                </div>
                <button
                  type="button"
                  className="voice-over-modal__filter-btn"
                  aria-label="Filter voices"
                  onClick={() => setFilterOpen((v) => !v)}
                >
                  <AutoEditIcon src={icFilter} size={20} />
                </button>
                {filterOpen && (
                  <div className="voice-over-modal__filter-popover">
                    <div>
                      <h4>Gender</h4>
                      <div className="voice-over-modal__filter-tags">
                        {(['All', 'Male', 'Female'] as GenderFilter[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`voice-over-modal__filter-tag${genderFilter === option ? ' voice-over-modal__filter-tag--selected' : ''}`}
                            onClick={() => setGenderFilter(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4>Speaking style</h4>
                      <div className="voice-over-modal__filter-tags">
                        {(['All', 'Neutral', 'Friendly', 'Cheerful', 'Serious'] as StyleFilter[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`voice-over-modal__filter-tag${styleFilter === option ? ' voice-over-modal__filter-tag--selected' : ''}`}
                            onClick={() => setStyleFilter(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="voice-over-modal__list">
                {filteredSampleVoices.map((voice) => {
                  const inUse = voice.id === selectedVoiceId
                  return (
                    <button
                      key={voice.id}
                      type="button"
                      className={`voice-over-modal__row${inUse ? ' voice-over-modal__row--active' : ''}`}
                      onClick={() => handleUse(voice)}
                    >
                      <img src={voiceAvatar} alt="" className="voice-over-modal__avatar" />
                      <span className="voice-over-modal__row-name">{voice.name}</span>
                      {inUse ? (
                        <span className="ae-btn ae-btn--primary ae-btn--small">USE</span>
                      ) : (
                        <span className="voice-over-modal__style-tag" style={{ background: TAG_COLORS[voice.tag] }}>
                          {voice.tag}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          ) : myVoices.length === 0 ? (
            <div className="voice-over-modal__empty">
              <img src={myVoicesEmptyIllustration} alt="" className="voice-over-modal__empty-icon" />
              <h3>No voices yet</h3>
              <p>Record or import audio to clone your voice</p>
            </div>
          ) : (
            <div className="voice-over-modal__list">
              {myVoices.map((voice) => {
                const isActive = activeMyVoiceId === voice.id
                return (
                  <div key={voice.id} className={`voice-over-modal__row${isActive ? ' voice-over-modal__row--active' : ''}`}>
                    <button
                      type="button"
                      className="voice-over-modal__play-btn"
                      aria-label={isActive ? 'Pause' : 'Play'}
                      onClick={() => setActiveMyVoiceId(isActive ? null : voice.id)}
                    >
                      <AutoEditIcon src={isActive ? icPause : icPlay} size={16} />
                    </button>
                    <span className="voice-over-modal__row-name">{voice.name}</span>
                    {isActive && (
                      <>
                        <button type="button" className="ae-btn ae-btn--primary ae-btn--small" onClick={() => handleUse(voice)}>
                          USE
                        </button>
                        <button
                          type="button"
                          className="voice-over-modal__delete-btn"
                          aria-label="Delete voice"
                          onClick={() => setDeleteTarget(voice)}
                        >
                          <AutoEditIcon src={icDelete} size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {tab === 'Sample Voices' ? (
          <div className="ae-modal__footer">
            <button type="button" className="ae-btn ae-btn--outline" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="ae-btn ae-btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <div className="voice-over-modal__my-voices-footer">
            <button type="button" className="ae-btn ae-btn--brand-outline" onClick={handleImportClick}>
              <AutoEditIcon src={icUpload} size={18} />
              Import
            </button>
            <button type="button" className="ae-btn ae-btn--primary" onClick={() => setRecordFlowOpen(true)}>
              <AutoEditIcon src={icMic} size={18} />
              Record
            </button>
          </div>
        )}
      </div>

      {importPreviewOpen && (
        <div className="ae-modal-overlay">
          <div className="ae-modal ae-modal--narrow">
            <h2 className="ae-modal__heading">Import Voice</h2>
            <p className="ae-modal__subtext">Preview the voice before importing it to My Voices.</p>
            <div className="voice-over-modal__row voice-over-modal__row--preview">
              <button type="button" className="voice-over-modal__play-btn voice-over-modal__play-btn--large" aria-label="Preview">
                <AutoEditIcon src={icPlay} size={20} />
              </button>
              <span className="voice-over-modal__preview-info">
                <strong>My Voice {myVoices.length + 1}</strong>
                <span>00:30</span>
              </span>
            </div>
            <div className="ae-modal__footer">
              <button type="button" className="ae-btn ae-btn--outline" onClick={() => setImportPreviewOpen(false)}>
                Cancel
              </button>
              <button type="button" className="ae-btn ae-btn--primary" onClick={handleImportClone}>
                Clone
                <span className="ae-btn__credits">
                  <img src={icCredit} alt="" />
                  {IMPORT_CLONE_CREDITS}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="ae-modal-overlay">
          <div className="ae-modal ae-modal--narrow">
            <h2 className="ae-modal__heading">Delete voice?</h2>
            <p className="ae-modal__subtext">
              Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.
            </p>
            <div className="ae-modal__footer">
              <button type="button" className="ae-btn ae-btn--outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="ae-btn ae-btn--danger"
                onClick={() => {
                  onDeleteMyVoice(deleteTarget.id)
                  setActiveMyVoiceId(null)
                  setDeleteTarget(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {recordFlowOpen && (
        <VoiceCloneModal cloneCredits={RECORD_CLONE_CREDITS} onCancel={() => setRecordFlowOpen(false)} onComplete={handleRecordClone} />
      )}
    </div>
  )
}

export default VoiceOverStyleModal
