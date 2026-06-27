import mongoose from 'mongoose'

export default async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri || uri.includes('YOUR_PASSWORD_HERE')) {
    console.log('⚠️  MongoDB URI not configured — running in DEMO MODE (no database)')
    console.log('   Edit the .env file with your MongoDB Atlas connection string')
    console.log('   See the setup_guide.md for instructions\n')
    return null
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.log('\n💡 Common fixes:')
    console.log('   1. Check your password in .env (no special chars like @, #, %)')
    console.log('   2. Whitelist your IP in MongoDB Atlas → Network Access')
    console.log('   3. Make sure your cluster is active at cloud.mongodb.com\n')
    // Don't crash — run in demo mode
    return null
  }
}
