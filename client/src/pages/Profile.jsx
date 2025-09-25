import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './Profile.css'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [userRecipes, setUserRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetchUserProfile()
    fetchUserRecipes()
  }, [navigate])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Fallback to mock data
      setUser({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'Passionate home cook who loves experimenting with new recipes and sharing them with the community.'
      })
    }
  }

  const fetchUserRecipes = async () => {
    try {
      const token = localStorage.getItem('token')
      // In a real app, you'd fetch user's recipes from the API
      // For now, we'll use mock data
      setUserRecipes(getMockUserRecipes())
    } catch (error) {
      console.error('Error fetching user recipes:', error)
      setUserRecipes(getMockUserRecipes())
    } finally {
      setLoading(false)
    }
  }

  const getMockUserRecipes = () => [
    {
      id: 1,
      title: "Creamy Spinach Garlic Chicken",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop",
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      rating: 4.8,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Classic Tiramisu",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      prepTime: 30,
      cookTime: 0,
      servings: 8,
      rating: 4.9,
      createdAt: "2024-01-10"
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="profile">
        <Header />
        <div className="loading">Loading profile...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile">
      <Header />
      
      <div className="profile-content">
        <div className="container">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                  alt="Profile" 
                />
              </div>
              <div className="profile-details">
                <h1>{user?.fullName || 'User'}</h1>
                <p className="profile-bio">
                  {user?.bio || 'Passionate home cook who loves experimenting with new recipes and sharing them with the community.'}
                </p>
                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{userRecipes.length}</span>
                    <span className="stat-label">Recipes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">1.2k</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">856</span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button className="btn btn-outline" onClick={() => navigate('/add-recipe')}>
                Add New Recipe
              </button>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="profile-sections">
            <div className="section-header">
              <h2>My Recipes</h2>
              <p>Recipes you've shared with the community</p>
            </div>

            {userRecipes.length > 0 ? (
              <div className="recipes-grid">
                {userRecipes.map(recipe => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="recipe-image">
                      <img src={recipe.image} alt={recipe.title} />
                    </div>
                    <div className="recipe-content">
                      <h3>{recipe.title}</h3>
                      <div className="recipe-meta">
                        <span className="time">{recipe.prepTime + recipe.cookTime} min</span>
                        <span className="servings">{recipe.servings} servings</span>
                      </div>
                      <div className="recipe-footer">
                        <div className="rating">
                          <span className="stars">⭐</span>
                          <span>{recipe.rating}</span>
                        </div>
                        <span className="date">{new Date(recipe.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🍳</div>
                <h3>No recipes yet</h3>
                <p>Start sharing your culinary creations with the community!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/add-recipe')}
                >
                  Add Your First Recipe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile
