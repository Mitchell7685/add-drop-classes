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