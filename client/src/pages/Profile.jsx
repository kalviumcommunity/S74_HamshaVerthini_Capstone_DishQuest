import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { API_BASE_URL, DEFAULT_RECIPE_IMAGE, getRecipeImageUrl } from '../config/api'
import './Profile.css'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [createdRecipes, setCreatedRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [activeTab, setActiveTab] = useState('my-recipes')
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', bio: '' })
  const [updating, setUpdating] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetchUserProfile()
  }, [navigate])

  const fetchUserProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data) {
        setUser(response.data.user)
        setCreatedRecipes(response.data.createdRecipes || [])
        setSavedRecipes(response.data.savedRecipes || [])
        setEditForm({
          fullName: response.data.user.fullName || response.data.user.username || '',
          bio: response.data.user.bio || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_BASE_URL}/api/users/profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data && response.data.user) {
        setUser(prev => ({ ...prev, ...response.data.user }))
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCreatedRecipes(prev => prev.filter(r => r._id !== recipeId))
    } catch (err) {
      console.error('Error deleting recipe:', err)
      alert('Failed to delete recipe.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="profile">
        <Header />
        <div className="loading-container">🍳 Fetching profile details...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="profile">
      <Header />
      
      <div className="profile-content">
        <div className="container">
          {/* Profile Header Card */}
          <div className="profile-header-card">
            <div className="profile-info-left">
              <div className="profile-avatar">
                <div className="profile-avatar-icon">
                  👤
                </div>
              </div>
              <div className="profile-details">
                <h1>{user?.fullName || user?.username || 'Culinary Lover'}</h1>
                <p className="profile-email">📧 {user?.email}</p>
                <p className="profile-bio">
                  {user?.bio || 'Passionate home cook who loves experimenting with new recipes and sharing them with the DishQuest community.'}
                </p>
                
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-number">{createdRecipes.length}</span>
                    <span className="stat-label">Recipes Shared</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{savedRecipes.length}</span>
                    <span className="stat-label">Saved Recipes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/add-recipe')}>
                + New Recipe
              </button>
              <button className="btn btn-outline logout-action-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Inline Edit Form */}
          {isEditing && (
            <div className="edit-profile-card">
              <h3>Edit Profile Information</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    rows="3"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Profile Navigation Tabs */}
          <div className="profile-tabs-bar">
            <button 
              className={`tab-btn ${activeTab === 'my-recipes' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-recipes')}
            >
              📖 My Shared Recipes ({createdRecipes.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'saved-recipes' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved-recipes')}
            >
              ❤️ Saved Bookmarks ({savedRecipes.length})
            </button>
          </div>

          {/* Tab Panes */}
          <div className="profile-sections">
            {activeTab === 'my-recipes' && (
              createdRecipes.length > 0 ? (
                <div className="recipes-grid">
                  {createdRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card">
                      <div className="recipe-image" onClick={() => navigate(`/recipe/${recipe._id}`)}>
                        <img 
                          src={getRecipeImageUrl(recipe.image)} 
                          alt={recipe.title} 
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = DEFAULT_RECIPE_IMAGE
                          }}
                        />
                        <span className="recipe-category-tag">{recipe.category}</span>
                      </div>
                      <div className="recipe-content">
                        <h3 onClick={() => navigate(`/recipe/${recipe._id}`)}>{recipe.title}</h3>
                        <div className="recipe-meta">
                          <span>⏱️ {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                          <span>👥 {recipe.servings || 4} servings</span>
                        </div>
                        <div className="recipe-card-footer">
                          <span className="rating">⭐ {recipe.rating ? recipe.rating.toFixed(1) : "5.0"}</span>
                          <button 
                            className="delete-recipe-btn"
                            onClick={() => handleDeleteRecipe(recipe._id)}
                            title="Delete this recipe"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🍳</div>
                  <h3>No recipes published yet</h3>
                  <p>Share your culinary creations with the community today!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/add-recipe')}
                  >
                    Add Your First Recipe
                  </button>
                </div>
              )
            )}

            {activeTab === 'saved-recipes' && (
              savedRecipes.length > 0 ? (
                <div className="recipes-grid">
                  {savedRecipes.map(recipe => (
                    <div 
                      key={recipe._id} 
                      className="recipe-card clickable"
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                    >
                      <div className="recipe-image">
                        <img 
                          src={getRecipeImageUrl(recipe.image)} 
                          alt={recipe.title} 
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = DEFAULT_RECIPE_IMAGE
                          }}
                        />
                        <span className="recipe-category-tag">{recipe.category}</span>
                      </div>
                      <div className="recipe-content">
                        <h3>{recipe.title}</h3>
                        <div className="recipe-meta">
                          <span>👩‍🍳 {recipe.authorName || 'Chef'}</span>
                          <span>⏱️ {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                        </div>
                        <div className="recipe-card-footer">
                          <span className="rating">⭐ {recipe.rating ? recipe.rating.toFixed(1) : "5.0"}</span>
                          <span className="view-link">View Recipe →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🤍</div>
                  <h3>No saved bookmarks yet</h3>
                  <p>Browse recipes and click the heart icon to save your favorites!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/browse')}
                  >
                    Explore Recipes
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile
