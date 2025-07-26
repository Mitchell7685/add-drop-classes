import { getCourses, createCourse, updateCourse, deleteCourse } from '@/lib/mongo/courses'

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { Courses, error } = await getCourses()
            if (error) throw new Error(error)

            return res.status(200).json({ courses: Courses })
        }   catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
    
    if (req.method === 'POST') {
        try {
            const courseData = req.body
            const { course, error } = await createCourse(courseData)
            
            if (error) {
                return res.status(400).json({ error })
            }
            
            return res.status(201).json({ 
                success: true, 
                course,
                message: 'Course created successfully'
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
    
    if (req.method === 'PUT') {
        try {
            const { courseId, ...updateData } = req.body
            
            if (!courseId) {
                return res.status(400).json({ error: 'Course ID is required' })
            }
            
            const { course, error } = await updateCourse(courseId, updateData)
            
            if (error) {
                return res.status(400).json({ error })
            }
            
            return res.status(200).json({
                success: true,
                course,
                message: 'Course updated successfully'
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
    
    if (req.method === 'DELETE') {
        try {
            const { courseId } = req.body
            
            if (!courseId) {
                return res.status(400).json({ error: 'Course ID is required' })
            }
            
            const { error } = await deleteCourse(courseId)
            
            if (error) {
                return res.status(400).json({ error })
            }
            
            return res.status(200).json({
                success: true,
                message: 'Course deleted successfully'
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} is not allowed.`)
}

export default handler

