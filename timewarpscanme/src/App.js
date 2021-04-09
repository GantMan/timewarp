import './App.css'
import Intro from './Intro'
import Warper from './Warper'

import { useCookies } from 'react-cookie'

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
      return <Warper resetSeen={resetSeen} />
    } else {
      return <Intro exploreClick={setSeen} />
    }
  }

  return <div className="site">{showContent()}</div>
}

export default App
