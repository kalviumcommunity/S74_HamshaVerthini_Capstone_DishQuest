import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Heart,
  Clock,
  User,
  Star,
  X,
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
  Gauge,
  Tag,
  Globe
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { API_BASE_URL, DEFAULT_RECIPE_IMAGE, getRecipeImageUrl } from '../config/api'
import './BrowseRecipes.css'

const CATEGORY_OPTIONS = [
  { id: '', label: 'All Recipes' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'snack', label: 'Snacks' }
]

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

      if (response.data && Array.isArray(response.data.recipes)) {
        setRecipes(response.data.recipes)
      } else if (Array.isArray(response.data)) {
        setRecipes(response.data)
      } else {
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
    if (!difficulty) return 'medium'
    return difficulty.toLowerCase()
  }

  const hasActiveFilters =
    filters.category || filters.cuisine || filters.difficulty || filters.search

  return (
    <div className="browse-recipes">
      <Header />

      <main className="browse-content">
        <div className="container">

          {/* Page Banner */}
          <header className="page-header">
            <div className="header-badge">
              <Sparkles size={14} className="sparkle-icon" />
              <span>Explore Collection</span>
            </div>
            <h1>Explore Recipes</h1>
            <p>
              Discover authentic home-cooked meals, trending dishes, and quick weeknight favorites.
            </p>

            {/* Quick Category Chips */}
            <div className="quick-category-pills">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`pill-btn ${filters.category === cat.id ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </header>

          <div className="browse-layout">

            {/* ================= FILTER SIDEBAR ================= */}
            <aside className="filters-sidebar">

              <div className="filter-sidebar-header">
                <h3>
                  <SlidersHorizontal size={18} className="sidebar-icon" />
                  Filter Recipes
                </h3>

                {hasActiveFilters && (
                  <button
                    className="clear-btn"
                    onClick={clearFilters}
                    title="Reset all filters"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                )}
              </div>

              {/* Search Field */}
              <div className="filter-group">
                <label htmlFor="search-input">
                  <Search size={14} className="label-icon" />
                  Search
                </label>
                <div className="search-input-wrapper">
                  <Search size={16} className="search-field-icon" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search by recipe or ingredient..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    className="filter-input"
                  />
                  {filters.search && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => handleFilterChange('search', '')}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="filter-group">
                <label htmlFor="category-select">
                  <Tag size={14} className="label-icon" />
                  Category
                </label>

                <select
                  id="category-select"
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
                  <option value="snack">Snacks</option>
                </select>
              </div>

              {/* Cuisine Dropdown */}
              <div className="filter-group">
                <label htmlFor="cuisine-select">
                  <Globe size={14} className="label-icon" />
                  Cuisine
                </label>

                <select
                  id="cuisine-select"
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

              {/* Difficulty Dropdown */}
              <div className="filter-group">
                <label htmlFor="difficulty-select">
                  <Gauge size={14} className="label-icon" />
                  Difficulty
                </label>

                <select
                  id="difficulty-select"
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

            </aside>

            {/* ================= RECIPES MAIN GRID ================= */}
            <section className="recipes-content">

              {/* Active Filter Chips Bar */}
              {hasActiveFilters && (
                <div className="active-filter-chips">
                  <span className="active-filter-label">Active Filters:</span>
                  {filters.search && (
                    <span className="chip">
                      "{filters.search}"
                      <X size={12} onClick={() => handleFilterChange('search', '')} />
                    </span>
                  )}
                  {filters.category && (
                    <span className="chip">
                      {filters.category}
                      <X size={12} onClick={() => handleFilterChange('category', '')} />
                    </span>
                  )}
                  {filters.cuisine && (
                    <span className="chip">
                      {filters.cuisine}
                      <X size={12} onClick={() => handleFilterChange('cuisine', '')} />
                    </span>
                  )}
                  {filters.difficulty && (
                    <span className="chip">
                      {filters.difficulty}
                      <X size={12} onClick={() => handleFilterChange('difficulty', '')} />
                    </span>
                  )}
                  <button className="clear-chips-link" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>
              )}

              {loading ? (

                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading delicious recipes...</p>
                </div>

              ) : recipes.length === 0 ? (

                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <UtensilsCrossed size={36} />
                  </div>

                  <h3>No recipes match your criteria</h3>

                  <p>
                    Try broadening your search or resetting your filters to explore more recipes.
                  </p>

                  <button
                    className="btn-reset-filters"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </button>
                </div>

              ) : (

                <>
                  {/* Results Header Count */}
                  <div className="results-meta-bar">
                    <span className="recipe-count">
                      Showing <strong>{recipes.length}</strong> {recipes.length === 1 ? 'recipe' : 'recipes'}
                    </span>
                  </div>

                  <div className="recipe-grid">

                    {recipes.map((recipe) => {

                      const recipeId = String(recipe._id)
                      const isSaved = savedRecipeIds.includes(recipeId)
                      const totalTime =
                        Number(recipe.prepTime || 0) +
                        Number(recipe.cookTime || 0)

                      return (
                        <article
                          key={recipeId}
                          className="recipe-card"
                          onClick={() => navigate(`/recipe/${recipeId}`)}
                        >

                          {/* Recipe Image Wrap */}
                          <div className="recipe-image-wrap">

                            <img
                              src={getRecipeImage(recipe.image)}
                              alt={recipe.title || 'Recipe'}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = DEFAULT_RECIPE_IMAGE
                              }}
                            />

                            {/* Category Tag */}
                            <span className="recipe-category-tag">
                              {recipe.category || 'Recipe'}
                            </span>

                            {/* Favorite Button */}
                            <button
                              type="button"
                              className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                              onClick={(e) => handleToggleSave(e, recipeId)}
                              title={isSaved ? 'Remove bookmark' : 'Save recipe'}
                              aria-label={isSaved ? 'Remove bookmark' : 'Save recipe'}
                            >
                              <Heart
                                size={18}
                                className={isSaved ? 'heart-icon saved' : 'heart-icon'}
                                fill={isSaved ? '#e53e3e' : 'none'}
                              />
                            </button>

                          </div>

                          {/* Recipe Content Body */}
                          <div className="recipe-card-body">

                            <h3 className="recipe-card-title">
                              {recipe.title || 'Untitled Recipe'}
                            </h3>

                            <div className="recipe-author">
                              <User size={13} className="author-icon" />
                              <span>{recipe.authorName || 'Chef'}</span>
                            </div>

                            {/* Meta Badges */}
                            <div className="recipe-meta-row">
                              {totalTime > 0 && (
                                <span className="meta-item time">
                                  <Clock size={13} />
                                  <span>{totalTime} mins</span>
                                </span>
                              )}

                              <span
                                className={`difficulty-badge ${getDifficultyClass(
                                  recipe.difficulty
                                )}`}
                              >
                                {recipe.difficulty || 'Medium'}
                              </span>
                            </div>

                            {/* Card Footer */}
                            <div className="recipe-card-footer">
                              <div className="rating-block">
                                <Star size={14} className="star-icon" fill="#f59e0b" />
                                <span className="rating-val">
                                  {typeof recipe.rating === 'number'
                                    ? recipe.rating.toFixed(1)
                                    : '5.0'}
                                </span>
                                <span className="reviews-count">
                                  ({recipe.numReviews || 1})
                                </span>
                              </div>

                              <span className="view-link">
                                View
                                <ChevronRight size={14} className="arrow-icon" />
                              </span>
                            </div>

                          </div>

                        </article>
                      )
                    })}

                  </div>
                </>
              )}

            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BrowseRecipes