import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './RecipeDetail.css'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('ingredients')
  const [recipe, setRecipe] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    fetchRecipe()
    fetchReviews()
  }, [id])

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`)
      setRecipe(response.data)
    } catch (error) {
      console.error('Error fetching recipe:', error)
      // Fallback to mock data
      setRecipe(getMockRecipe())
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${id}`)
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      // Fallback to mock data
      setReviews(getMockReviews())
    }
  }

  const getMockRecipe = () => ({
    id: id,
    title: "Creamy Spinach Garlic Chicken",
    author: "Maria Johnson",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=600&h=400&fit=crop",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    ingredients: [
      "4 boneless chicken breasts",
      "2 cups fresh spinach",
      "4 cloves garlic, minced",
      "1 cup heavy cream",
      "1/2 cup grated parmesan cheese",
      "2 tbsp olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Season chicken breasts with salt and pepper",
      "Heat olive oil in a large skillet over medium-high heat",
      "Cook chicken for 6-7 minutes per side until golden",
      "Remove chicken and set aside",
      "Add garlic to the same skillet and cook for 1 minute",
      "Add spinach and cook until wilted",
      "Pour in heavy cream and bring to a simmer",
      "Add parmesan cheese and stir until melted",
      "Return chicken to skillet and simmer for 5 minutes",
      "Serve hot with your favorite side dish"
    ],
    notes: "This dish pairs perfectly with rice or pasta. You can also add mushrooms for extra flavor."
  })

  const getMockReviews = () => [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      comment: "Absolutely delicious! The chicken was so tender and the sauce was perfect.",
      date: "2024-01-15"
    },
    {
      id: 2,
      user: "John D.",
      rating: 4,
      comment: "Great recipe! I added some mushrooms and it turned out amazing.",
      date: "2024-01-10"
    }
  ]

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      await axios.post('http://localhost:5000/api/reviews', {
        recipeId: id,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setNewReview({ rating: 5, comment: '' })
      fetchReviews() // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  if (loading) {
    return (
      <div className="recipe-detail">
        <Header />
        <div className="loading">Loading recipe...</div>
        <Footer />
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <Header />
        <div className="error">Recipe not found</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="recipe-detail">
      <Header />
      
      <div className="recipe-content">
        <div className="container">
          {/* Recipe Header */}
          <div className="recipe-header">
            <div className="recipe-info">
              <h1>{recipe.title}</h1>
              <p className="author">By {recipe.author}</p>
            </div>
            <div className="recipe-image">
              <img src={recipe.image} alt={recipe.title} />
            </div>
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Prep Time</span>
                <span className="meta-value">{recipe.prepTime} min</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cook Time</span>
                <span className="meta-value">{recipe.cookTime} min</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Servings</span>
                <span className="meta-value">{recipe.servings}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </button>
            <button 
              className={`tab ${activeTab === 'instructions' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructions')}
            >
              Instructions
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Notes & Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'ingredients' && (
              <div className="ingredients-section">
                <h2>Ingredients</h2>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <input type="checkbox" id={`ingredient-${index}`} />
                      <label htmlFor={`ingredient-${index}`}>{ingredient}</label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="instructions-section">
                <h2>Instructions</h2>
                <ol className="instructions-list">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="instruction-item">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section">
                <h2>Notes & Reviews</h2>
                
                {recipe.notes && (
                  <div className="notes-section">
                    <h3>Recipe Notes</h3>
                    <p>{recipe.notes}</p>
                  </div>
                )}

                <div className="reviews-list">
                  <h3>Reviews</h3>
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.user}</span>
                        <div className="review-rating">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>⭐</span>
                          ))}
                        </div>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="add-review">
                  <h3>Leave a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label>Rating</label>
                      <select 
                        value={newReview.rating} 
                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={2}>2 Stars</option>
                        <option value={1}>1 Star</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        rows="4"
                        placeholder="Share your thoughts about this recipe..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default RecipeDetail
