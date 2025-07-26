import { loginUser } from '@/lib/mongo/users'

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { username, password } = req.body
            
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' })
            }
            
            const { user, error } = await loginUser(username, password)
            
            if (error) {
                return res.status(401).json({ error })
            }
            
            // In a real application, you would set up proper session management here
            // For now, we'll just return the user data
            return res.status(200).json({ 
                success: true, 
                user,
                message: 'Login successful'
            })
            
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} is not allowed.`)
}

export default handler
