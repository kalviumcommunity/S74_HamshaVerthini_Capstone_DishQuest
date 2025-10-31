import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import BrowseRecipes from './pages/BrowseRecipes'
import AddRecipe from './pages/AddRecipe'
import RecipeSubmission from './pages/RecipeSubmission'
import RecipeDetail from './pages/RecipeDetail'
import Profile from './pages/Profile'
import ProfileSetup from './pages/ProfileSetup'   // ✅ add this line
import './App.css'


import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/browse" element={<BrowseRecipes />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/recipe-submitted" element={<RecipeSubmission />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />

      </Routes>
    </div>
  )
}

export default App
