import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { API_BASE_URL, DEFAULT_RECIPE_IMAGE, getRecipeImageUrl } from '../config/api'
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

  // Sync filters with URL
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      cuisine: searchParams.get('cuisine') || '',
      difficulty: searchParams.get('difficulty') || '',
      search: searchParams.get('search') || ''
    })
  }, [searchParams])

  // Fetch recipes whenever filters change
  useEffect(() => {
    fetchRecipes()
  }, [filters])

  // Fetch saved recipes only once when page loads
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setSavedRecipeIds([])
      return
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          },
          params: {
            _t: Date.now()
          }
        }
      )

      if (response.data?.user) {
        const savedRecipes = response.data.user.savedRecipes || []

        const savedIds = savedRecipes
          .map((recipe) =>
            typeof recipe === 'object' ? recipe._id : recipe
          )
          .filter(Boolean)
          .map(String)

        setSavedRecipeIds(savedIds)
      }
    } catch (error) {
      console.error(
        'Error fetching user profile:',
        error.response?.data || error.message
      )
    }
  }

  const fetchRecipes = async () => {
    setLoading(true)

    try {
      const params = {
        _t: Date.now()
      }

      if (filters.category) {
        params.category = filters.category
      }

      if (filters.cuisine) {
        params.cuisine = filters.cuisine
      }

      if (filters.difficulty) {
        params.difficulty = filters.difficulty
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim()
      }

      console.log('Fetching recipes with params:', params)

      const response = await axios.get(
        `${API_BASE_URL}/api/recipes`,
        {
          params,
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      )

      console.log('Recipes API response:', response.data)

      // Handle the expected API structure
      if (response.data && Array.isArray(response.data.recipes)) {
        setRecipes(response.data.recipes)
      } else if (Array.isArray(response.data)) {
        // Fallback if API directly returns an array
        setRecipes(response.data)
      } else {
        console.error('Unexpected API response:', response.data)
        setRecipes([])
      }
    } catch (error) {
      console.error(
        'Error fetching recipes:',
        error.response?.data || error.message
      )

      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    }

    setFilters(newFilters)

    const params = new URLSearchParams()

    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params.set(key, newFilters[key])
      }
    })

    setSearchParams(params)
  }

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      cuisine: '',
      difficulty: '',
      search: ''
    }

    setFilters(emptyFilters)
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
      const response = await axios.post(
        `${API_BASE_URL}/api/recipes/${recipeId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          },
          params: {
            _t: Date.now()
          }
        }
      )

      if (response.data?.isSaved) {
        setSavedRecipeIds((prev) => {
          if (prev.includes(String(recipeId))) {
            return prev
          }

          return [...prev, String(recipeId)]
        })
      } else {
        setSavedRecipeIds((prev) =>
          prev.filter((id) => String(id) !== String(recipeId))
        )
      }
    } catch (error) {
      console.error(
        'Error toggling bookmark:',
        error.response?.data || error.message
      )
    }
  }

  const getRecipeImage = (image) => {
    return getRecipeImageUrl(image)
  }

  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return ''

    return difficulty.toLowerCase()
  }

  return (
    <div className="browse-recipes">
      <Header />

      <div className="browse-content">
        <div className="container">

          {/* Page Header */}
          <div className="page-header">
            <h1>Browse Recipes 🍽️</h1>
            <p>
              Explore delicious culinary creations shared by our community
            </p>
          </div>

          <div className="browse-layout">

            {/* ================= FILTER SIDEBAR ================= */}
            <div className="filters-sidebar">

              <div className="filter-sidebar-header">
                <h3>
                  <span className="filter-icon">🎛️</span>
                  Filter Recipes
                </h3>

                {(
                  filters.category ||
                  filters.cuisine ||
                  filters.difficulty ||
                  filters.search
                ) && (
                  <button
                    className="clear-btn"
                    onClick={clearFilters}
                  >
                    ↺ Reset All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="filter-group">
                <label>
                  <span className="label-icon">🔍</span>
                  Search Keywords
                </label>

                <input
                  type="text"
                  placeholder="Title or ingredient..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange('search', e.target.value)
                  }
                  className="filter-input"
                />
              </div>

              {/* Category */}
              <div className="filter-group">
                <label>
                  <span className="label-icon">🏷️</span>
                  Category
                </label>

                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                >
                  <option value="">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="dessert">Dessert</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              {/* Cuisine */}
              <div className="filter-group">
                <label>
                  <span className="label-icon">🌐</span>
                  Cuisine
                </label>

                <select
                  value={filters.cuisine}
                  onChange={(e) =>
                    handleFilterChange('cuisine', e.target.value)
                  }
                >
                  <option value="">All Cuisines</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="asian">Asian</option>
                  <option value="american">American</option>
                  <option value="french">French</option>
                  <option value="indian">Indian</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="filter-group">
                <label>
                  <span className="label-icon">⚡</span>
                  Difficulty
                </label>

                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    handleFilterChange('difficulty', e.target.value)
                  }
                >
                  <option value="">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

            </div>

            {/* ================= RECIPES CONTENT ================= */}
            <div className="recipes-content">

              {loading ? (

                <div className="loading">
                  🍳 Fetching delicious recipes...
                </div>

              ) : recipes.length === 0 ? (

                <div className="empty-state">
                  <div className="empty-icon">🔎</div>

                  <h3>No recipes found</h3>

                  <p>
                    Try adjusting your search criteria or resetting filters.
                  </p>

                  <button
                    className="btn btn-outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>

              ) : (

                <>
                  {/* Recipe count */}
                  <div className="recipe-count">
                    Showing <strong>{recipes.length}</strong> recipes
                  </div>

                  <div className="recipe-grid">

                    {recipes.map((recipe) => {

                      const recipeId = String(recipe._id)

                      const isSaved = savedRecipeIds.includes(recipeId)

                      const totalTime =
                        Number(recipe.prepTime || 0) +
                        Number(recipe.cookTime || 0)

                      return (
                        <div
                          key={recipeId}
                          className="recipe-card clickable"
                          onClick={() =>
                            navigate(`/recipe/${recipeId}`)
                          }
                        >

                          {/* Recipe Image */}
                          <div className="recipe-image">

                            <img
                              src={getRecipeImage(recipe.image)}
                              alt={recipe.title || 'Recipe'}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = DEFAULT_IMAGE
                              }}
                            />

                            {/* Bookmark */}
                            <button
                              type="button"
                              className={`bookmark-btn ${
                                isSaved ? 'saved' : ''
                              }`}
                              onClick={(e) =>
                                handleToggleSave(e, recipeId)
                              }
                              title={
                                isSaved
                                  ? 'Remove bookmark'
                                  : 'Save recipe'
                              }
                              aria-label={
                                isSaved
                                  ? 'Remove bookmark'
                                  : 'Save recipe'
                              }
                            >
                              {isSaved ? '❤️' : '🤍'}
                            </button>

                            {/* Category */}
                            <span className="recipe-category-tag">
                              {recipe.category || 'Recipe'}
                            </span>

                          </div>

                          {/* Recipe Content */}
                          <div className="recipe-content">

                            <h3>
                              {recipe.title || 'Untitled Recipe'}
                            </h3>

                            <div className="recipe-meta">

                              <span>
                                👩‍🍳 {recipe.authorName || 'Chef'}
                              </span>

                              <span>
                                ⏱️ {totalTime} min
                              </span>

                              <span
                                className={`difficulty ${getDifficultyClass(
                                  recipe.difficulty
                                )}`}
                              >
                                💪 {recipe.difficulty || 'Medium'}
                              </span>

                            </div>

                            <div className="rating-row">

                              <div className="rating">
                                ⭐{' '}
                                {typeof recipe.rating === 'number'
                                  ? recipe.rating.toFixed(1)
                                  : '5.0'}

                                <span className="reviews-count">
                                  ({recipe.numReviews || 1})
                                </span>
                              </div>

                              <span className="view-link">
                                View Recipe →
                              </span>

                            </div>

                          </div>

                        </div>
                      )
                    })}

                  </div>
                </>
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