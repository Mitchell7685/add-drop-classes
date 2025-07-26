import clientPromise from ".";

let client
let db
let courses

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db('UniDB') // Specify your database name here
        courses = await db.collection('courses')
    } catch (error) {
        throw new Error('failed to establish connection to database') 
    }
}

;(async () => {
    await init()
})()

////////////////
/// COURSES ////
////////////////

export async function getCourses() {
    try {
        if (!courses) await init()
        const result = await courses
            .find({})
            .limit(20)
            .map(user => ({ ...user, _id: user._id.toString() }))
            .toArray()
        
        return {Courses: result}
    }   catch (error) {
        return { error: 'failed to fetch courses'}
    }
}

export async function createCourse(courseData) {
    try {
        if (!courses) await init()
        
        // Validate required fields
        const { id, title, description, instructor, duration_weeks, tags } = courseData
        if (!id || !title || !description || !instructor || !duration_weeks) {
            return { error: 'Missing required course fields' }
        }
        
        // Check if course ID already exists
        const existingCourse = await courses.findOne({ id: id })
        if (existingCourse) {
            return { error: 'Course ID already exists' }
        }
        
        // Create new course
        const newCourse = {
            id,
            title,
            description,
            instructor,
            duration_weeks: parseInt(duration_weeks),
            tags: tags || [],
            created_at: new Date(),
            updated_at: new Date()
        }
        
        const result = await courses.insertOne(newCourse)
        
        return { 
            course: { 
                ...newCourse, 
                _id: result.insertedId.toString() 
            }
        }
    } catch (error) {
        return { error: 'Failed to create course' }
    }
}

export async function updateCourse(courseId, updateData) {
    try {
        if (!courses) await init()
        const { ObjectId } = require('mongodb')
        
        // Remove _id from updateData if present
        const { _id, ...dataToUpdate } = updateData
        
        // Add updated timestamp
        dataToUpdate.updated_at = new Date()
        
        // Convert duration_weeks to number if present
        if (dataToUpdate.duration_weeks) {
            dataToUpdate.duration_weeks = parseInt(dataToUpdate.duration_weeks)
        }
        
        const result = await courses.updateOne(
            { _id: new ObjectId(courseId) },
            { $set: dataToUpdate }
        )
        
        if (result.matchedCount === 0) {
            return { error: 'Course not found' }
        }
        
        // Fetch and return updated course
        const updatedCourse = await courses.findOne({ _id: new ObjectId(courseId) })
        
        return { 
            course: { 
                ...updatedCourse, 
                _id: updatedCourse._id.toString() 
            }
        }
    } catch (error) {
        return { error: 'Failed to update course' }
    }
}

export async function deleteCourse(courseId) {
    try {
        if (!courses) await init()
        const { ObjectId } = require('mongodb')
        
        const result = await courses.deleteOne({ _id: new ObjectId(courseId) })
        
        if (result.deletedCount === 0) {
            return { error: 'Course not found' }
        }
        
        return { success: true }
    } catch (error) {
        return { error: 'Failed to delete course' }
    }
}