import { getUsers, enrollInCourse, unenrollFromCourse, addToCart, removeFromCart, enrollFromCart } from '@/lib/mongo/users'

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
            
            if (!action || !userId) {
                return res.status(400).json({ error: 'Missing required fields: action, userId' })
            }

            let result;
            if (action === 'enroll') {
                if (!courseId) {
                    return res.status(400).json({ error: 'Missing courseId for enroll action' })
                }
                result = await enrollInCourse(userId, courseId)
            } else if (action === 'unenroll') {
                if (!courseId) {
                    return res.status(400).json({ error: 'Missing courseId for unenroll action' })
                }
                result = await unenrollFromCourse(userId, courseId)
            } else if (action === 'addToCart') {
                if (!courseId) {
                    return res.status(400).json({ error: 'Missing courseId for addToCart action' })
                }
                result = await addToCart(userId, courseId)
            } else if (action === 'removeFromCart') {
                if (!courseId) {
                    return res.status(400).json({ error: 'Missing courseId for removeFromCart action' })
                }
                result = await removeFromCart(userId, courseId)
            } else if (action === 'enrollFromCart') {
                result = await enrollFromCart(userId)
            } else {
                return res.status(400).json({ error: 'Invalid action. Use "enroll", "unenroll", "addToCart", "removeFromCart", or "enrollFromCart"' })
            }

            if (result.error) {
                return res.status(400).json({ error: result.error })
            }

            return res.status(200).json({
                success: true,
                user: result.user,
                enrolledCount: result.enrolledCount,
                message: getActionMessage(action, result.enrolledCount)
            })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} is not allowed.`)
}

function getActionMessage(action, enrolledCount) {
    switch (action) {
        case 'enroll':
            return 'Successfully enrolled in course'
        case 'unenroll':
            return 'Successfully unenrolled from course'
        case 'addToCart':
            return 'Successfully added course to cart'
        case 'removeFromCart':
            return 'Successfully removed course from cart'
        case 'enrollFromCart':
            return `Successfully enrolled in ${enrolledCount} course${enrolledCount !== 1 ? 's' : ''} from cart`
        default:
            return 'Action completed successfully'
    }
}

export default handler
