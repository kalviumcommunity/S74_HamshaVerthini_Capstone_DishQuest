import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './AddRecipe.css'

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'dinner',
    cuisine: 'italian',
    prepTime: '15',
    cookTime: '20',
    servings: '4',
    difficulty: 'Medium',
    notes: '',
    imageUrl: ''
  })

  const [ingredientsList, setIngredientsList] = useState(['', '', ''])
  const [instructionsList, setInstructionsList] = useState(['', '', ''])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Dynamic Ingredients handlers
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredientsList]
    updated[index] = value
    setIngredientsList(updated)
  }

  const addIngredientField = () => {
    setIngredientsList([...ingredientsList, ''])
  }

  const removeIngredientField = (index) => {
    if (ingredientsList.length === 1) return
    setIngredientsList(ingredientsList.filter((_, i) => i !== index))
  }

  // Dynamic Instructions handlers
  const handleInstructionChange = (index, value) => {
    const updated = [...instructionsList]
    updated[index] = value
    setInstructionsList(updated)
  }

  const addInstructionField = () => {
    setInstructionsList([...instructionsList, ''])
  }

  const removeInstructionField = (index) => {
    if (instructionsList.length === 1) return
    setInstructionsList(instructionsList.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const cleanIngredients = ingredientsList.map(i => i.trim()).filter(Boolean)
    const cleanInstructions = instructionsList.map(i => i.trim()).filter(Boolean)

    if (cleanIngredients.length === 0) {
      setError('Please add at least one ingredient.')
      setLoading(false)
      return
    }

    if (cleanInstructions.length === 0) {
      setError('Please add at least one step of instruction.')
      setLoading(false)
      return
    }

    try {
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('category', formData.category)
      submitData.append('cuisine', formData.cuisine)
      submitData.append('prepTime', formData.prepTime)
      submitData.append('cookTime', formData.cookTime)
      submitData.append('servings', formData.servings)
      submitData.append('difficulty', formData.difficulty)
      submitData.append('notes', formData.notes)

      if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl)
      }

      if (imageFile) {
        submitData.append('image', imageFile)
      }

      // Add ingredients and instructions
      cleanIngredients.forEach(ing => submitData.append('ingredients', ing))
      cleanInstructions.forEach(inst => submitData.append('instructions', inst))

      await axios.post('http://localhost:5000/api/recipes', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      navigate('/recipe-submitted')
    } catch (err) {
      console.error('Error submitting recipe:', err)
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to submit recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-recipe">
      <Header />

      <div className="add-recipe-content">
        <div className="container">
          <div className="page-header">
            <h1>Share Your Recipe 📝</h1>
            <p>Publish your culinary masterpiece to inspire food lovers worldwide</p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit} className="recipe-form">
              {error && <div className="error-alert">{error}</div>}

              <div className="form-section">
                <h2>1. Recipe Basic Information</h2>

                <div className="form-group">
                  <label htmlFor="title">Recipe Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Creamy Tuscan Garlic Chicken"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Short Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Describe your dish, its flavor profile, and why you love it..."
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="dessert">Dessert</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="cuisine">Cuisine *</label>
                    <select
                      id="cuisine"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="italian">Italian</option>
                      <option value="mexican">Mexican</option>
                      <option value="asian">Asian</option>
                      <option value="american">American</option>
                      <option value="french">French</option>
                      <option value="indian">Indian</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label htmlFor="prepTime">Prep Time (min) *</label>
                    <input
                      type="number"
                      id="prepTime"
                      name="prepTime"
                      value={formData.prepTime}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cookTime">Cook Time (min) *</label>
                    <input
                      type="number"
                      id="cookTime"
                      name="cookTime"
                      value={formData.cookTime}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="servings">Servings *</label>
                    <input
                      type="number"
                      id="servings"
                      name="servings"
                      value={formData.servings}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty Level</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Recipe Image Section */}
              <div className="form-section">
                <h2>2. Recipe Photo</h2>
                <div className="image-upload-box">
                  <label>Upload Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  {imagePreview && (
                    <div className="preview-box">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}

                  <div className="or-divider">OR</div>

                  <label htmlFor="imageUrl">Image URL (Unsplash or Direct Link)</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="form-section">
                <h2>3. Ingredients List</h2>
                <div className="dynamic-inputs-list">
                  {ingredientsList.map((ingredient, idx) => (
                    <div key={idx} className="dynamic-input-row">
                      <span className="input-index">{idx + 1}.</span>
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(idx, e.target.value)}
                        placeholder={`e.g. 2 cups fresh spinach`}
                      />
                      {ingredientsList.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeIngredientField(idx)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm add-more-btn"
                  onClick={addIngredientField}
                >
                  + Add Another Ingredient
                </button>
              </div>

              {/* Instructions Section */}
              <div className="form-section">
                <h2>4. Step-by-Step Instructions</h2>
                <div className="dynamic-inputs-list">
                  {instructionsList.map((step, idx) => (
                    <div key={idx} className="dynamic-input-row">
                      <span className="input-index">Step {idx + 1}:</span>
                      <textarea
                        rows="2"
                        value={step}
                        onChange={(e) => handleInstructionChange(idx, e.target.value)}
                        placeholder={`Describe step ${idx + 1}...`}
                      />
                      {instructionsList.length > 1 && (
                        <button 
                          type="button" 
                          className="remove-btn"
                          onClick={() => removeInstructionField(idx)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm add-more-btn"
                  onClick={addInstructionField}
                >
                  + Add Another Step
                </button>
              </div>

              {/* Chef Notes Section */}
              <div className="form-section">
                <h2>5. Chef Notes & Serving Tips (Optional)</h2>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Share any special tips, ingredient substitutions, or wine pairings..."
                />
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                  {loading ? 'Publishing Recipe...' : 'Submit Recipe 🎉'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AddRecipe
