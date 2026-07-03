/**
 * Google Gemini AI Service
 * Uses real Gemini API when GEMINI_API_KEY is provided,
 * falls back to smart mock responses otherwise.
 */

import dotenv from 'dotenv'
dotenv.config()

let genAI = null
let initialized = false

// Try to initialize Gemini (lazy - called on first use)
async function initGemini() {
  if (initialized) return
  initialized = true

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'mock' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('ℹ️  AI running in MOCK MODE (no API key configured)')
    return
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    genAI = new GoogleGenerativeAI(apiKey)
    // Quick test
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const testResult = await model.generateContent('Say hello in one word')
    if (testResult.response) {
      console.log('✅ Google Gemini AI connected and verified')
    }
  } catch (error) {
    console.log('⚠️  Gemini AI key provided but could not connect:', error.message)
    console.log('   AI will use intelligent mock responses instead')
    genAI = null
  }
}

// Initialize immediately now that dotenv is loaded
initGemini()

// ── System prompts per role ──
const SYSTEM_PROMPTS = {
  student: `You are "PU Study Buddy", an AI assistant for students at the University of the Punjab. 
Help with: explaining concepts, study tips, solving problems, exam preparation, course guidance.
Be encouraging, clear, and concise. Use examples when explaining concepts.
Always respond in a helpful academic tone.`,

  teacher: `You are "PU Teaching Assistant", an AI assistant for faculty at the University of the Punjab.
Help with: creating quiz questions, grading rubrics, lesson planning, pedagogical strategies, research guidance.
Be professional and provide actionable suggestions.`,

  admin: `You are "PU Admin Assistant", an AI assistant for administrators at the University of the Punjab.
Help with: data analysis, report summaries, policy suggestions, system optimization.
Provide data-driven insights and actionable recommendations.`,
}

// ── Mock responses when no API key ──
const MOCK_RESPONSES = {
  student: [
    "Great question! Let me break this down for you. In data structures, a binary search tree (BST) maintains sorted order where left children are smaller and right children are larger than the parent node. This gives us O(log n) search time on average. Would you like me to explain the insertion algorithm?",
    "Based on your coursework, I recommend focusing on these key areas: 1) Review graph algorithms (BFS/DFS) for your upcoming exam 2) Practice dynamic programming problems 3) Revise sorting algorithm complexities. Would you like practice problems for any of these?",
    "Here's a study tip: Use the Feynman Technique — try explaining the concept to someone else in simple words. If you get stuck, that's where your gap is. Also, the University library has extended hours during exam season (until 11 PM). Want me to create a study schedule?",
  ],
  teacher: [
    "Here's a suggested rubric for the assignment:\n\n• **Correctness (40%)**: Does the solution produce the expected output?\n• **Code Quality (25%)**: Is the code clean, well-organized, and following conventions?\n• **Efficiency (20%)**: Is the algorithm optimized? Proper data structures used?\n• **Documentation (15%)**: Are there comments explaining complex logic?\n\nWould you like me to adjust the weightings?",
    "For creating effective quiz questions, consider Bloom's Taxonomy levels:\n1. **Remember**: Define terms, list properties\n2. **Understand**: Explain in your own words, compare concepts\n3. **Apply**: Solve a new problem using learned concepts\n4. **Analyze**: Debug code, identify patterns\n\nShall I generate sample questions for a specific topic?",
  ],
  admin: [
    "Based on the current enrollment data, here are key insights:\n\n📊 **Enrollment Trends**: CS department shows 12% growth YoY\n📉 **Attention Areas**: Arts faculty enrollment declined 3%\n💡 **Recommendation**: Consider launching Data Science and AI programs to capitalize on market demand\n📌 **Action Item**: Review faculty-to-student ratios in growing departments\n\nWould you like a detailed department-by-department breakdown?",
  ],
}

/**
 * Chat with AI — uses Gemini if available, mock otherwise
 */
export async function chatWithAI(message, role, context) {
  // Try real Gemini first
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const systemPrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS.student
      const fullPrompt = `${systemPrompt}\n\nUser message: ${message}${context ? `\n\nContext: ${context}` : ''}`

      const result = await model.generateContent(fullPrompt)
      return result.response.text()
    } catch (error) {
      console.error('Gemini API error, falling back to mock:', error.message)
    }
  }

  // Mock response
  const roleResponses = MOCK_RESPONSES[role] || MOCK_RESPONSES.student
  const randomResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)]

  // Simulate thinking delay
  await new Promise(resolve => setTimeout(resolve, 800))
  return randomResponse
}

/**
 * Get study recommendations for a student
 */
export async function getStudyRecommendations(user) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = `${SYSTEM_PROMPTS.student}\n\nGenerate 3 personalized study recommendations for a ${user.program || 'Computer Science'} student in semester ${user.semester || 6}. Return as a JSON array with fields: title, description, priority (high/medium/low).`

      const result = await model.generateContent(prompt)
      try {
        return JSON.parse(result.response.text())
      } catch {
        return [{ title: result.response.text(), description: '', priority: 'medium' }]
      }
    } catch (error) {
      console.error('Gemini recommendations error:', error.message)
    }
  }

  return [
    { title: 'Review Graph Algorithms', description: 'Focus on BFS, DFS, and shortest path algorithms for your upcoming exam', priority: 'high' },
    { title: 'Practice Dynamic Programming', description: 'Solve at least 5 DP problems from the textbook exercises', priority: 'medium' },
    { title: 'Read Research Papers', description: 'Read 2 recent papers on machine learning for your AI course project', priority: 'low' },
  ]
}

/**
 * Auto-grade a submission using AI
 */
export async function autoGradeSubmission(content, rubric, totalMarks) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = `Grade this student submission based on the rubric. Return JSON with fields: marks (number out of ${totalMarks}), feedback (string), breakdown (array of {criteria, score, comment}).

Rubric: ${rubric || 'Correctness 40%, Code Quality 25%, Efficiency 20%, Documentation 15%'}

Submission:
${content}`

      const result = await model.generateContent(prompt)
      try {
        return JSON.parse(result.response.text())
      } catch {
        return { marks: null, feedback: result.response.text(), breakdown: [] }
      }
    } catch (error) {
      console.error('Gemini grading error:', error.message)
    }
  }

  return {
    marks: Math.floor(totalMarks * 0.78),
    feedback: 'Good work overall. The solution is correct and well-structured. Consider adding more comments and optimizing the time complexity of the sorting function.',
    breakdown: [
      { criteria: 'Correctness', score: '36/40', comment: 'All test cases pass' },
      { criteria: 'Code Quality', score: '20/25', comment: 'Clean code, minor naming issues' },
      { criteria: 'Efficiency', score: '15/20', comment: 'Could use more efficient sorting' },
      { criteria: 'Documentation', score: '7/15', comment: 'Needs more inline comments' },
    ],
  }
}
