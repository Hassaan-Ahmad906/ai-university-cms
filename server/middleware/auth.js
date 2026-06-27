import jwt from 'jsonwebtoken'

/**
 * JWT Authentication Middleware
 * Verifies the Bearer token from the Authorization header
 * and attaches the decoded user to req.user
 */
export function protect(req, res, next) {
  let token = null

  // Check for token in Authorization header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized — no token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized — invalid or expired token' })
  }
}

/**
 * Role-Based Access Control Middleware
 * Usage: authorize('admin', 'vc', 'dean')
 * Only allows users with the specified roles
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied — role '${req.user.role}' is not authorized for this action`,
      })
    }

    next()
  }
}
