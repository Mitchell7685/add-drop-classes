import { getUsers, enrollInCourse, unenrollFromCourse } from '@/lib/mongo/users'

const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const { Users, error } = await getUsers()
            if (error) throw new Error(error)

            return res.status(200).json({ users: Users })
        }   catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'POST') {
        try {
            const { action, userId, courseId } = req.body
            
            if (!action || !userId || !courseId) {
                return res.status(400).json({ error: 'Missing required fields: action, userId, courseId' })
            }

            let result;
            if (action === 'enroll') {
                result = await enrollInCourse(userId, courseId)
            } else if (action === 'unenroll') {
                result = await unenrollFromCourse(userId, courseId)
            } else {
                return res.status(400).json({ error: 'Invalid action. Use "enroll" or "unenroll"' })
            }

            if (result.error) {
                return res.status(400).json({ error: result.error })
            }

            return res.status(200).json({
                success: true,
                user: result.user,
                message: `Successfully ${action === 'enroll' ? 'enrolled in' : 'unenrolled from'} course`
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} is not allowed.`)
}

export default handler
