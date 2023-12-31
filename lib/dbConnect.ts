import mongoose from 'mongoose'
declare global {
  var mongoose: any // This must be a `var` and not a `let / const`
}

const user = process.env.MONGODB_USER!
const password = process.env.MONGODB_PASS!
const host = process.env.MONGODB_HOST!
const db = process.env.MONGODB_DB!
const MONGODB_URI = `mongodb+srv://${user}:${password}@${host}`

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: db
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
