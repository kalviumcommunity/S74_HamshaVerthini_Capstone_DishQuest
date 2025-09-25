import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './RecipeSubmission.css'

const RecipeSubmission = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Auto redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="recipe-submission">
      <div className="submission-container">
        <div className="submission-card">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          <h1>RECIPE SUBMITTED</h1>
          <p>Thank you for sharing your recipe with the community!</p>
          <p className="redirect-text">You will be redirected to the home page in a few seconds...</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeSubmission
