import { useState } from 'react'
import './App.css'
import { BrowserRouter,Route,Routes,redirect} from 'react-router-dom'
import Login from './pages/Login/Login'
import Signup from './pages/Login/Signup'
import AllowAuthenticatedOnly from './components/AuthenticatedRoutes/AuthenticatedRoutes'
import CheckAuthenticated from './components/AuthenticatedRoutes/Check_Authenticated'
import Play from './pages/Play/play'
import Home_Page from './pages/Home/Home'
import Test from './pages/Home/test'


function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
    <Routes>
      <Route  path='/login' element={<CheckAuthenticated Component={Login} />} />
      <Route path='/signup' element={<CheckAuthenticated Component={Signup} />} />
      <Route path='/room/:room_id' element={<AllowAuthenticatedOnly Component={Play}/>} />
      <Route path='/test' element={<AllowAuthenticatedOnly Component={Test}/>} />
      <Route path='/' element={<AllowAuthenticatedOnly Component={Home_Page}/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
