import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './BrowseRecipes.css'

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedRecipeIds, setSavedRecipeIds] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    cuisine: searchParams.get('cuisine') || '',
    difficulty: searchParams.get('difficulty') || '',
    search: searchParams.get('search') || ''
  })

  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      cuisine: searchParams.get('cuisine') || '',
      difficulty: searchParams.get('difficulty') || '',
      search: searchParams.get('search') || ''
    })
  }, [searchParams])

  useEffect(() => {
    fetchRecipes()
    fetchUserProfile()
  }, [filters])

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data && response.data.user) {
        const savedIds = (response.data.user.savedRecipes || []).map(r => typeof r === 'object' ? r._id : r)
        setSavedRecipeIds(savedIds)
      }
    } catch (err) {
      console.error('Error fetching user profile saved recipes:', err)
    }
  }

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.cuisine) params.append('cuisine', filters.cuisine)
      if (filters.difficulty) params.append('difficulty', filters.difficulty)
      if (filters.search) params.append('search', filters.search)

      const response = await axios.get(`http://localhost:5000/api/recipes?${params.toString()}`)
      if (response.data && response.data.recipes) {
        setRecipes(response.data.recipes)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error.message)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    setFilters(newFilters)

    const params = new URLSearchParams()
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) params.set(key, newFilters[key])
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({ category: '', cuisine: '', difficulty: '', search: '' })
    setSearchParams({})
  }

  const handleToggleSave = async (e, recipeId) => {
    e.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/recipes/${recipeId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.isSaved) {
        setSavedRecipeIds(prev => [...prev, recipeId])
      } else {
        setSavedRecipeIds(prev => prev.filter(id => id !== recipeId))
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err)
    }
  }

  return (
    <div className="browse-recipes">
      <Header />

      <div className="browse-content">
        <div className="container">
          <div className="page-header">
            <h1>Browse Recipes 🍽️</h1>
            <p>Explore delicious culinary creations shared by our community</p>
          </div>

          <div className="browse-layout">
            {/* Filters Sidebar */}
            <div className="filters-sidebar">
              <div className="filter-sidebar-header">
                <h3>Filter Recipes</h3>
                {(filters.category || filters.cuisine || filters.difficulty || filters.search) && (
                  <button className="clear-btn" onClick={clearFilters}>Reset All</button>
                )}
              </div>

              <div className="filter-group">
                <label>Search Keywords</label>
                <input 
                  type="text" 
                  placeholder="Title or ingredient..."
                  value={filters.search} 
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Cuisine</label>
                <select value={filters.cuisine} onChange={(e) => handleFilterChange('cuisine', e.target.value)}>
                  <option value="">All Cuisines</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="asian">Asian</option>
                  <option value="american">American</option>
                  <option value="french">French</option>
                  <option value="indian">Indian</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Difficulty</label>
                <select value={filters.difficulty} onChange={(e) => handleFilterChange('difficulty', e.target.value)}>
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="recipes-content">
              {loading ? (
                <div className="loading">🍳 Fetching delicious recipes...</div>
              ) : recipes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔎</div>
                  <h3>No recipes found</h3>
                  <p>Try adjusting your search criteria or resetting filters.</p>
                  <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
                </div>
              ) : (
                <div className="recipe-grid">
                  {recipes.map(recipe => {
                    const isSaved = savedRecipeIds.includes(recipe._id)
                    return (
                      <div 
                        key={recipe._id} 
                        className="recipe-card clickable"
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                      >
                        <div className="recipe-image">
                          <img
                            src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop"}
                            alt={recipe.title}
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop"
                            }}
                            loading="lazy"
                          />
                          <button 
                            className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                            onClick={(e) => handleToggleSave(e, recipe._id)}
                            title={isSaved ? "Remove bookmark" : "Save recipe"}
                          >
                            {isSaved ? '❤️' : '🤍'}
                          </button>
                          <span className="recipe-category-tag">{recipe.category}</span>
                        </div>
                        <div className="recipe-content">
                          <h3>{recipe.title}</h3>
                          <div className="recipe-meta">
                            <span>👩‍🍳 {recipe.authorName || 'Chef'}</span>
                            <span>⏱️ {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                            <span>💪 {recipe.difficulty || 'Medium'}</span>
                          </div>
                          <div className="rating-row">
                            <div className="rating">
                              ⭐ {recipe.rating ? recipe.rating.toFixed(1) : "5.0"}
                              <span className="reviews-count">({recipe.numReviews || 1})</span>
                            </div>
                            <span className="view-link">View Recipe →</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BrowseRecipes
