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