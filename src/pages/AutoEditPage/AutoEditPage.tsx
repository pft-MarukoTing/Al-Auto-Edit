import { useState } from 'react'
import AutoEditHeader from './AutoEditHeader'
import AutoEditSidebar from './AutoEditSidebar'
import AutoEditPanel from './AutoEditPanel'
import AutoEditCanvas from './AutoEditCanvas'
import SettingsModal from './SettingsModal'
import DescribeClipsModal from './DescribeClipsModal'
import VoiceOverStyleModal from './VoiceOverStyleModal'
import {
  STYLE_OPTIONS,
  SAMPLE_VOICES,
  MOCK_MEDIA,
  DEFAULT_SETTINGS,
  MIN_MATERIAL_SECONDS,
  computeMaterialSeconds,
  estimateGenerateCredits,
  type MediaItem,
  type Voice,
  type AutoEditSettings,
} from './autoEditData'
import './AutoEditPage.css'

const DEFAULT_CREDITS = 500

// Figma "v 1.36.0_261014_Auto-Edit" (node 14442:166410) — full "AI Auto-Edit"
// tool, ported from the PM's flow prototype
// (yco-prototypes.vercel.app/prototypes/auto-clip) into this Figma UI.
// Standalone route/page + its own tool-shell layout (see AutoEditPage.css) —
// intentionally not using YCM's own AppLayout/Sidebar, since this is a
// different product chrome ("YouCam Online Editor").
function AutoEditPage() {
  const [credits, setCredits] = useState(DEFAULT_CREDITS)
  const [ideaText, setIdeaText] = useState('')
  const [selectedStyleId, setSelectedStyleId] = useState('')
  const [voiceOverOn, setVoiceOverOn] = useState(true)
  const [selectedVoice, setSelectedVoice] = useState<Voice>(SAMPLE_VOICES[0])
  const [myVoices, setMyVoices] = useState<Voice[]>([])
  const [settings, setSettings] = useState<AutoEditSettings>(DEFAULT_SETTINGS)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [activeCanvasTab, setActiveCanvasTab] = useState<'Media' | 'History'>('Media')
  const [warningDismissed, setWarningDismissed] = useState(false)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [describeClipsClipId, setDescribeClipsClipId] = useState<string | null>(null)
  const [voiceOverOpen, setVoiceOverOpen] = useState(false)

  const materialSeconds = computeMaterialSeconds(media)
  const canGenerate = media.length > 0 && ideaText.trim().length > 0 && materialSeconds >= MIN_MATERIAL_SECONDS
  const generateCredits = estimateGenerateCredits(settings, media.length)

  function handleSelectStyle(id: string) {
    // Confirmed live in the PM prototype: picking a style overwrites whatever
    // is in the idea textarea with that style's canned description — no
    // merge, no confirmation, even if the user had typed their own text.
    const style = STYLE_OPTIONS.find((option) => option.id === id)
    setSelectedStyleId(id)
    if (style) setIdeaText(style.description)
  }

  function handleClearIdea() {
    // Also confirmed live: the idea textarea's clear (×) button deselects
    // whichever style was chosen, not just the text — the two are linked.
    setIdeaText('')
    setSelectedStyleId('')
  }

  function handleImportMedia() {
    // No real file picker in this mock-data-only prototype (per CLAUDE.md) —
    // "Import media" instantly populates the mock clip set, matching the live
    // PM prototype's own behavior.
    setMedia(MOCK_MEDIA)
    setWarningDismissed(false)
  }

  function handleDeleteClip(id: string) {
    setMedia((prev) => prev.filter((item) => item.id !== id))
  }

  function handleReorderMedia(fromIndex: number, toIndex: number) {
    setMedia((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  function handleSaveHints(hints: Record<string, string>) {
    setMedia((prev) => prev.map((item) => ({ ...item, hint: hints[item.id] ?? item.hint })))
    setDescribeClipsClipId(null)
  }

  function handleAddMyVoice(voice: Voice, creditsSpent: number) {
    setMyVoices((prev) => [...prev, voice])
    setCredits((prev) => Math.max(0, prev - creditsSpent))
  }

  function handleGenerate() {
    if (!canGenerate) return
    // Mock-only: a real backend would kick off generation here. Left as a
    // no-op action point since this prototype has no result/processing page
    // wired up for Auto-Edit yet.
    window.alert(`Generating your video (mock) — ${generateCredits} credits.`)
  }

  return (
    <div className="auto-edit-page">
      <AutoEditHeader credits={credits} />
      <div className="auto-edit-page__body">
        <AutoEditSidebar />
        <div className="auto-edit-page__main">
          <AutoEditPanel
            ideaText={ideaText}
            onIdeaTextChange={setIdeaText}
            onClearIdea={handleClearIdea}
            selectedStyleId={selectedStyleId}
            onSelectStyle={handleSelectStyle}
            voiceOverOn={voiceOverOn}
            onVoiceOverToggle={setVoiceOverOn}
            selectedVoice={selectedVoice}
            onOpenVoiceOver={() => setVoiceOverOpen(true)}
            settings={settings}
            onOpenSettings={() => setSettingsOpen(true)}
            canGenerate={canGenerate}
            generateCredits={generateCredits}
            materialSeconds={materialSeconds}
            onGenerate={handleGenerate}
          />
          <AutoEditCanvas
            activeTab={activeCanvasTab}
            onTabChange={setActiveCanvasTab}
            media={media}
            materialSeconds={materialSeconds}
            onImportMedia={handleImportMedia}
            onEditClip={(id) => setDescribeClipsClipId(id)}
            onDeleteClip={handleDeleteClip}
            onReorderMedia={handleReorderMedia}
            warningDismissed={warningDismissed}
            onDismissWarning={() => setWarningDismissed(true)}
          />
        </div>
      </div>

      {settingsOpen && (
        <SettingsModal
          initialSettings={settings}
          materialSeconds={materialSeconds}
          voiceOverOn={voiceOverOn}
          mediaCount={media.length}
          onCancel={() => setSettingsOpen(false)}
          onDone={(next) => {
            setSettings(next)
            setSettingsOpen(false)
          }}
        />
      )}

      {describeClipsClipId && (
        <DescribeClipsModal
          media={media}
          initialClipId={describeClipsClipId}
          onCancel={() => setDescribeClipsClipId(null)}
          onDone={handleSaveHints}
        />
      )}

      {voiceOverOpen && (
        <VoiceOverStyleModal
          selectedVoiceId={selectedVoice.id}
          myVoices={myVoices}
          onSelectVoice={setSelectedVoice}
          onAddMyVoice={handleAddMyVoice}
          onDeleteMyVoice={(id) => setMyVoices((prev) => prev.filter((v) => v.id !== id))}
          onClose={() => setVoiceOverOpen(false)}
        />
      )}
    </div>
  )
}

export default AutoEditPage
