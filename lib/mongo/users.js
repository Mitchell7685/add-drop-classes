import clientPromise from ".";

let client
let db
let users

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db('UniDB') // Specify your database name here
        users = await db.collection('users')
    } catch (error) {
        throw new Error('failed to establish connection to database') 
    }
}

;(async () => {
    await init()
})()

////////////////
/// users  ////
////////////////

export async function getUsers() {
    try {
        if (!users) await init()
        const result = await users
            .find({})
            .limit(20)
            .map(user => ({ ...user, _id: user._id.toString() }))
            .toArray()
        
        return {Users: result}
    }   catch (error) {
        return { error: 'failed to fetch users'}
    }
}

export async function loginUser(username, password) {
    try {
        if (!users) await init()
        
        // Find user by username
        const user = await users.findOne({ username: username })
        
        if (!user) {
            return { error: 'User not found' }
        }
        
        // Check password (in a real app, you'd hash passwords)
        if (user.password !== password) {
            return { error: 'Invalid password' }
        }
        
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user
        return { 
            user: { 
                ...userWithoutPassword, 
                _id: user._id.toString() 
            }
        }
    } catch (error) {
        return { error: 'Login failed' }
    }
}

export async function enrollInCourse(userId, courseId) {
    try {
        if (!users) await init()
        const { ObjectId } = require('mongodb')
        
        // Check if user exists
        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return { error: 'User not found' }
        }
        
        // Check if already enrolled
        if (user.enrolled_courses && user.enrolled_courses.includes(courseId)) {
            return { error: 'Already enrolled in this course' }
        }
        
        // Add course to enrolled_courses array
        const result = await users.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $addToSet: { enrolled_courses: courseId },
                $set: { updated_at: new Date() }
            }
        )
        
        if (result.matchedCount === 0) {
            return { error: 'User not found' }
        }
        
        // Fetch and return updated user
        const updatedUser = await users.findOne({ _id: new ObjectId(userId) })
        const { password: _, ...userWithoutPassword } = updatedUser
        
        return { 
            user: { 
                ...userWithoutPassword, 
                _id: updatedUser._id.toString() 
            }
        }
    } catch (error) {
        return { error: 'Failed to enroll in course' }
    }
}

export async function unenrollFromCourse(userId, courseId) {
    try {
        if (!users) await init()
        const { ObjectId } = require('mongodb')
        
        // Remove course from enrolled_courses array
        const result = await users.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $pull: { enrolled_courses: courseId },
                $set: { updated_at: new Date() }
            }
        )
        
        if (result.matchedCount === 0) {
            return { error: 'User not found' }
        }
        
        // Fetch and return updated user
        const updatedUser = await users.findOne({ _id: new ObjectId(userId) })
        const { password: _, ...userWithoutPassword } = updatedUser
        
        return { 
            user: { 
                ...userWithoutPassword, 
                _id: updatedUser._id.toString() 
            }
        }
    } catch (error) {
        return { error: 'Failed to unenroll from course' }
    }
}