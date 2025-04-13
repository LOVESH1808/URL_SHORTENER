
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import HomePage from './pages/HomePage'
import UsersPage from './pages/UsersPage'
import URLAnalytics from './pages/URLAnalytics'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={HomePage}/>
        <Route path='/usersPage' Component={UsersPage}/>
        <Route path= '/:shortURL' Component={URLAnalytics} />
      </Routes>
    </div>
  )
}

export default App
