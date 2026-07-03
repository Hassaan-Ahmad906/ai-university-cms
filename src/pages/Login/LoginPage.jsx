import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Eye, EyeOff, Mail, Lock, Sun, Moon, 
  ArrowRight
} from 'lucide-react'
import puLogoDark from '../../assets/logo/pu-logo-dark.png'
import puLogoLight from '../../assets/logo/pu-logo-light.png'
import './LoginPage.css'



export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password')
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logo = theme === 'dark' ? puLogoDark : puLogoLight

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-gradient" />
        <div className="login-bg-pattern" />
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
      </div>

      {/* Theme toggle */}
      <button className="login-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="login-container">
        {/* Left panel - Branding */}
        <div className="login-branding">
          <div className="login-branding-content">
            <div className="login-logo-wrapper">
              <img src={logo} alt="University of the Punjab" className="login-logo" />
            </div>
            <h1 className="login-university-name">
              University of <span className="login-gold-text">the Punjab</span>
            </h1>
            <p className="login-tagline">Campus Management System</p>
            
            <div className="login-features">
              <div className="login-feature">
                {/* <div className="login-feature-icon">
                  <Sparkles size={18} />
                </div> */}
                {/* <div>
                  <h4>AI-Powered Learning</h4>
                  <p>Smart recommendations & instant help</p>
                </div> */}
              </div>
              <div className="login-feature">
                {/* <div className="login-feature-icon">
                  <BookOpen size={18} />
                </div> */}
                {/* <div>
                  <h4>Complete Academic Suite</h4>
                  <p>Courses, exams, grades & transcripts</p>
                </div> */}
              </div>
              <div className="login-feature">
                {/* <div className="login-feature-icon">
                  <Users size={18} />
                </div> */}
                {/* <div>
                  <h4>Multi-Role Access</h4>
                  <p>Students, faculty & administration</p>
                </div> */}
              </div>
            </div>
          </div>
          
          <div className="login-branding-footer">
            <p>© 2026 University of the Punjab. All rights reserved.</p>
          </div>
        </div>

        {/* Right panel - Login form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your account</p>
            </div>



            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="login-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="login-input-group">
                <label htmlFor="email">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail size={18} className="login-input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@pu.edu.pk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="password">Password</label>
                <div className="login-input-wrapper">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" />
                  <span className="login-checkbox-custom" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="login-forgot">Forgot password?</a>
              </div>

              <button
                type="submit"
                className={`login-submit ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="login-spinner" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="login-register-link">
              Don't have an account? <a href="#">Contact Administration</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
