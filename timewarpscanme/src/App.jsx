import { lazy, Suspense } from 'react'
import './App.css'
import Intro from './Intro'

import { useCookies } from 'react-cookie'

// The scanner pulls in TensorFlow.js and Material UI, so only load it when needed
const Warper = lazy(() => import('./Warper'))

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['seen'])

  function setSeen() {
    setCookie('seen', true)
  }

  function resetSeen() {
    removeCookie('seen')
  }

  function showContent() {
    if (cookies.seen) {
      return (
        <Suspense fallback={<p className="loading">Warming up the scanner…</p>}>
          <Warper resetSeen={resetSeen} />
        </Suspense>
      )
    } else {
      return <Intro exploreClick={setSeen} />
    }
  }

  return (
    <div className={cookies.seen ? 'site' : 'site site--intro'}>
      {showContent()}
    </div>
  )
}

export default App
