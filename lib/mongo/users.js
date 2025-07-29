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

export async function addToCart(userId, courseId) {
    try {
        if (!users) await init()
        const { ObjectId } = require('mongodb')
        
        // Check if user exists
        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return { error: 'User not found' }
        }
        
        // Check if already in cart
        if (user.cart && user.cart.includes(courseId)) {
            return { error: 'Course already in cart' }
        }
        
        // Check if already enrolled
        if (user.enrolled_courses && user.enrolled_courses.includes(courseId)) {
            return { error: 'Already enrolled in this course' }
        }
        
        // Add course to cart array
        const result = await users.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $addToSet: { cart: courseId },
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
        return { error: 'Failed to add course to cart' }
    }
}

export async function removeFromCart(userId, courseId) {
    try {
        if (!users) await init()
        const { ObjectId } = require('mongodb')
        
        // Remove course from cart array
        const result = await users.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $pull: { cart: courseId },
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
        return { error: 'Failed to remove course from cart' }
    }
}

export async function enrollFromCart(userId) {
    try {
        if (!users) await init()
        const { ObjectId } = require('mongodb')
        
        // Get user with cart
        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return { error: 'User not found' }
        }
        
        if (!user.cart || user.cart.length === 0) {
            return { error: 'Cart is empty' }
        }
        
        // Move all cart items to enrolled_courses and clear cart
        const cartCourses = user.cart || []
        const currentEnrolled = user.enrolled_courses || []
        
        // Filter out courses already enrolled to avoid duplicates
        const newCourses = cartCourses.filter(courseId => !currentEnrolled.includes(courseId))
        
        const result = await users.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $addToSet: { enrolled_courses: { $each: newCourses } },
                $unset: { cart: "" },
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
            },
            enrolledCount: newCourses.length
        }
    } catch (error) {
        return { error: 'Failed to enroll from cart' }
    }
}