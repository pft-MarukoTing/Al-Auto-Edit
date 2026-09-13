import AutoEditPage from './pages/AutoEditPage/AutoEditPage'

// This repo is dedicated to the AI Auto-Edit feature only (split out from the
// YCM UI prototype monorepo, which covers unrelated MV/Song creation pages)
// — so the root route renders it directly, no path-based routing needed.
function App() {
  return <AutoEditPage />
}

export default App
