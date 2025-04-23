import jwt from 'jsonwebtoken';

export async function POST(req, res) {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }

    try {
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const newToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.json({ token: newToken });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
}
