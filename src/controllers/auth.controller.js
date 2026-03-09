import { Op } from 'sequelize';
import { User } from '../models/user.js';
import logger from '../logs/logger.js';
import { comparar } from '../common/bycript.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: { [Op.like]: username } } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if(!(await comparar(password, user.password))) {
            return res.status(401).json({ message: 'Usuario no autorizado' });
        }

        console.log(env.jwt_expires_in)
        const token = jwt.sign({ userId: user.id }, env.jwt_secret, {
            expiresIn: eval(env.jwt_expires_in)
        })

        return res.json({ token });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
    
}

export default {
    login
}
