// Run this script to fix the database structure
// node fix-database.js

const { MongoClient } = require('mongodb');

async function fixDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI || 'your-mongodb-connection-string');
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('UniDB');
        const users = db.collection('users');
        
        // Find all users where enrolled_courses is a string
        const usersToUpdate = await users.find({
            enrolled_courses: { $type: "string" }
        }).toArray();
        
        console.log(`Found ${usersToUpdate.length} users to update`);
        
        for (const user of usersToUpdate) {
            const updateDoc = {};
            
            // Convert enrolled_courses from string to array
            if (typeof user.enrolled_courses === 'string') {
                try {
                    updateDoc.enrolled_courses = JSON.parse(user.enrolled_courses);
                } catch (e) {
                    updateDoc.enrolled_courses = [];
                }
            }
            
            // Add cart field if it doesn't exist
            if (!user.cart) {
                updateDoc.cart = [];
            }
            
            // Update the user
            await users.updateOne(
                { _id: user._id },
                { $set: updateDoc }
            );
            
            console.log(`Updated user: ${user.username}`);
        }
        
        console.log('Database fix completed!');
        
    } catch (error) {
        console.error('Error fixing database:', error);
    } finally {
        await client.close();
    }
}

fixDatabase();
