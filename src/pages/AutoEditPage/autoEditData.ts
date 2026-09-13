// Mock data + types for the AI Auto-Edit tool (Figma "v 1.36.0_261014_Auto-Edit",
// node 14442:166410). This page is a standalone prototype tool with its own light
// visual language (see AutoEditPage.css), separate from the rest of YCM's dark
// AppLayout/Sidebar — no real backend, everything here is local mock state.

// All images below are downloaded directly from the Figma file itself
// (jb5SgyshmuPse0L7IFm0QO, "v 1.36.0_261014_Auto-Edit") via get_screenshot /
// get_design_context asset URLs — not reused from this repo's other mock
// catalogs (MV covers, storyboard clips, avatars), which belong to a
// different feature (YCM's own MV creation flow) and were only a placeholder
// stand-in during the first pass. See src/assets/auto-edit/ for the archive.
import styleDailyVlog from '../../assets/auto-edit/style/daily-vlog.png'
import styleGeneral from '../../assets/auto-edit/style/general.png'
import styleTravelMemo from '../../assets/auto-edit/style/travel-memo.png'
import styleMustVisit from '../../assets/auto-edit/style/must-visit.png'

// This "auto_clip_avatar" component resolves to the exact same underlying
// stock photo (confirmed by diffing the raw fill assets byte-for-byte) in
// every context it's used in Figma — the main panel's default preset, the
// Sample Voices "in use" row, and the 6 shared "generic" rows all point at
// one placeholder photo, not distinct per-voice portraits. One shared 256px
// asset (cropped from the fill's real 1024x1024 source, not a 44px
// screenshot of the tiny composited avatar) replaces the 3 separate
// low-resolution files from the first pass.
import voiceAvatar from '../../assets/auto-edit/voices/voice-avatar.png'

// Hand-rebuilt as a vector (see the .svg's own comment) — the rasterized
// get_screenshot export of this node never exceeds its native 120x120px,
// which read as blurry on a retina display.
import myVoicesEmptyIllustration from '../../assets/auto-edit/illustrations/my-voices-empty.svg'

import clip1 from '../../assets/auto-edit/media/clip-1.png'
import clip2 from '../../assets/auto-edit/media/clip-2.png'
import clip3 from '../../assets/auto-edit/media/clip-3.png'
import clip4 from '../../assets/auto-edit/media/clip-4.png'
import clip5 from '../../assets/auto-edit/media/clip-5.png'
import clip6 from '../../assets/auto-edit/media/clip-6.png'
import clip7 from '../../assets/auto-edit/media/clip-7.png'

export { voiceAvatar, myVoicesEmptyIllustration }

export interface StyleOption {
  id: string
  label: string
  thumbnail: string
  /** Confirmed live in the PM prototype: picking a style overwrites the idea
   *  textarea with this canned description (replacing whatever was there,
   *  no merge/append) — this is real flow logic, not a visual detail, so it
   *  follows the PM prototype rather than Figma per this project's own
   *  source-of-truth split. */
  description: string
}

// Figma "Select Style" row only actually contains these 4 thumbnails (the
// row itself is authored at 414px inside the 400px panel, clipping visually —
// see auto-edit-spec-main.md open question #3 — but there is no 5th/6th
// thumbnail anywhere in the Figma file). The live PM prototype's DOM showed
// 2 more ("Destination Guide", "Baby Journal") — those were dropped here
// since they have no Figma source to pull a real image from; only add them
// back once the designer provides thumbnails for them.
export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'daily-vlog',
    label: 'Daily Vlog',
    thumbnail: styleDailyVlog,
    description: 'Daily vlog with clear POV, real and authentic moments',
  },
  {
    id: 'general',
    label: 'General',
    thumbnail: styleGeneral,
    description: 'All-purpose video script for any type of creators',
  },
  {
    id: 'travel-memo',
    label: 'Travel Memo',
    thumbnail: styleTravelMemo,
    description: 'Travel memory with clear POV, real moments, authentic feel',
  },
  {
    id: 'must-visit',
    label: 'Must-Visit',
    thumbnail: styleMustVisit,
    description: 'Must-visit guide with attractions, food, lively tone',
  },
]

export interface Voice {
  id: string
  name: string
  language: string
  tag: 'Serious' | 'Cheerful' | 'Neutral' | 'Friendly'
  gender: 'Male' | 'Female'
  isCustom?: boolean
}

// Figma's Sample Voices list mock data is all literally "Jenny" x7 (flagged in
// the build spec as placeholder/lorem copy) — the live prototype instead shows
// 7 distinct named voices, which reads as the intended real content model, so
// that's what's used here. Figma's visual layout/styling is still followed
// exactly (see VoiceOverStyleModal.css).
export const SAMPLE_VOICES: Voice[] = [
  { id: 'soft-olivia', name: 'Soft Olivia', language: 'English', tag: 'Neutral', gender: 'Female' },
  { id: 'bright-noah', name: 'Bright Noah', language: 'English', tag: 'Friendly', gender: 'Male' },
  { id: 'calm-ethan', name: 'Calm Ethan', language: 'English', tag: 'Neutral', gender: 'Male' },
  { id: 'warm-sophia', name: 'Warm Sophia', language: 'English', tag: 'Cheerful', gender: 'Female' },
  { id: 'radiant-mia', name: 'Radiant Mia', language: 'English', tag: 'Friendly', gender: 'Female' },
  { id: 'curious-emma', name: 'Curious Emma', language: 'English', tag: 'Neutral', gender: 'Female' },
  { id: 'wise-olivia', name: 'Wise Olivia', language: 'English', tag: 'Neutral', gender: 'Female' },
]

export const TAG_COLORS: Record<Voice['tag'], string> = {
  Serious: '#e8eaff',
  Cheerful: '#fdeece',
  Neutral: '#ffffff',
  Friendly: '#ddfcf0',
}

export const LANGUAGE_OPTIONS = [
  'English',
  '正體中文',
  '简体中文',
  '日本語',
  'Français',
  '한국어',
  'Deutsch',
  'Español',
  'Português',
  'Italiano',
]

export interface MediaItem {
  id: string
  kind: 'video' | 'photo'
  src: string
  ratio: number // width / height, drives the justified-gallery item width
  durationLabel?: string // videos only — literal Figma copy, always "00:05" regardless of durationSeconds below
  durationSeconds: number // internal mock value driving the material/credits math (photos fixed at 2s per copy)
  hint: string
}

// These 7 thumbnails are downloaded directly from the "Ideal State" grid
// frame's actual `Thumbnail-media` nodes (each screenshotted individually so
// Figma's own layered-image compositing renders correctly as one flat PNG).
// The grid frame's context was cut off by the tool's output-size limit after
// 7 of the 9 slots ("3/60 videos, 6/300 photos" implies 9) — clip-2 and
// clip-3 (both photos) are reused for the remaining 2 slots rather than
// introducing another unrelated stock photo; revisit if the designer wants
// all 9 to be visually distinct. Kind + aspect ratio per slot match exactly
// what Figma's own layout showed (4:3 landscape / 1:1 square carry a "00:05"
// duration badge = video; 3:4 portrait and the 2 reused slots = photo).
export const MOCK_MEDIA: MediaItem[] = [
  { id: 'clip-1', kind: 'video', src: clip1, ratio: 232 / 174, durationLabel: '00:05', durationSeconds: 12, hint: '' },
  { id: 'clip-2', kind: 'photo', src: clip2, ratio: 131 / 174, durationSeconds: 2, hint: '' },
  { id: 'clip-3', kind: 'photo', src: clip3, ratio: 131 / 174, durationSeconds: 2, hint: '' },
  { id: 'clip-4', kind: 'video', src: clip4, ratio: 1, durationLabel: '00:05', durationSeconds: 12, hint: '' },
  { id: 'clip-5', kind: 'video', src: clip5, ratio: 250 / 187, durationLabel: '00:05', durationSeconds: 12, hint: '' },
  { id: 'clip-6', kind: 'photo', src: clip6, ratio: 1, durationSeconds: 2, hint: '' },
  { id: 'clip-7', kind: 'photo', src: clip7, ratio: 250 / 187, durationSeconds: 2, hint: '' },
  { id: 'clip-8', kind: 'photo', src: clip2, ratio: 131 / 174, durationSeconds: 2, hint: '' },
  { id: 'clip-9', kind: 'photo', src: clip3, ratio: 131 / 174, durationSeconds: 2, hint: '' },
]

export const MIN_MATERIAL_SECONDS = 30
export const MAX_MATERIAL_SECONDS = 30 * 60

export function computeMaterialSeconds(media: MediaItem[]): number {
  return media.reduce((total, item) => total + item.durationSeconds, 0)
}

export type Duration = '30s' | '1m' | '1m 30s' | '2m' | '2m 30s' | '3m'
export const DURATION_OPTIONS: Duration[] = ['30s', '1m', '1m 30s', '2m', '2m 30s', '3m']
export const DURATION_SECONDS: Record<Duration, number> = {
  '30s': 30,
  '1m': 60,
  '1m 30s': 90,
  '2m': 120,
  '2m 30s': 150,
  '3m': 180,
}

// Figma's Settings frame shows two options both labeled "9:16" (one selected/
// blue, one unselected/grey) with no third label visible before the row was
// captured — flagged as ambiguous in the build spec. Reconciled here against
// this project's own convention (MVCreatePage/SongCreatePage both use a plain
// 9:16 / 16:9 pair) plus Figma's separate "1:1" chip, giving three options.
export type AspectRatio = '9:16' | '16:9' | '1:1'
export const ASPECT_RATIO_OPTIONS: AspectRatio[] = ['9:16', '16:9', '1:1']

export interface AutoEditSettings {
  duration: Duration
  aspectRatio: AspectRatio
  backgroundMusic: boolean
  smartAudio: boolean
  webSearch: boolean
  photoMotion: boolean
  /** Only user-changeable when Voice-Over is off (confirmed live in the PM
   *  prototype — the Subtitle row is a real dropdown in that state, and a
   *  disabled "matches voice-over language" readout otherwise). */
  subtitleLanguage: string
}

export const DEFAULT_SETTINGS: AutoEditSettings = {
  duration: '30s',
  aspectRatio: '9:16',
  backgroundMusic: true,
  smartAudio: true,
  webSearch: true,
  photoMotion: true,
  subtitleLanguage: 'English',
}

// Rough mock credit model: a base cost per duration tier, +1 credit per 5
// photos/clips of media once any is imported. Not meant to reproduce the PM
// prototype's exact numbers — just enough to make the Generate button's cost
// feel settings-dependent, per the confirmed live behavior that it's dynamic.
const BASE_CREDITS_BY_DURATION: Record<Duration, number> = {
  '30s': 30,
  '1m': 45,
  '1m 30s': 60,
  '2m': 75,
  '2m 30s': 90,
  '3m': 105,
}

export function estimateGenerateCredits(settings: AutoEditSettings, mediaCount: number): number {
  const base = BASE_CREDITS_BY_DURATION[settings.duration]
  const mediaSurcharge = mediaCount > 0 ? Math.ceil(mediaCount / 3) * 5 : 0
  return base + mediaSurcharge
}

export function formatMaterialLabel(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
