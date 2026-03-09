import { User } from "../models/user.js";
import { Task } from "../models/task.js";
import logger from "../logs/logger.js";
import { Status } from "../constans/index.js";
import { encriptar } from "../common/bycript.js";
import { sequelize } from "../database/database.js";

async function create(req, res) {
  const { username, password } = req.body;
  try {
    const newUser = await User.create({
      username,
      password
    })
    return res.status(201).json(newUser);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
  res.send(req.body)
}

async function getUsers(_req, res) {
  try {
    const users = await User.findAndCountAll({
      attributes: ['id', 'username', 'password', 'status'],
      order: [['id', 'DESC']],
      where: {
        status: Status.ACTIVE
      }
    });
    return res.json({
      total: users.count,
      data: users.rows
    });
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
}

async function findUserById(_req, res) {
  const { id } = _req.params;
  try {
    const user = await User.findOne({
      attributes: [ 'username', 'status'],
      where: {
        id
      }
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(user);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
  
}

const updateUser = async (_req, res) => {
  const { id } = _req.params;
  const { username, password } = _req.body;
  const passwordHashed = password ? await encriptar(password) : undefined;
  try {
    const user = await User.update(
      {
        username,
        password: passwordHashed
      },
      {
        where: {
          id
        }
      }
    );
    return res.json(user);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
  
}

const deleteR = async (_req, res) => {
  const { id } = _req.params;
  try {
    await User.destroy({
      where: {
        id
      }
    });
    return res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
}

const activeInactive = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'No existe el status' });
  }
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    if(user.status === status) {
      return res.status(400).json({ message: 'El usuario ya tiene ese status' });
    }
    user.status = status;
    await user.save();
    return res.json(user);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
}

const getPaginatedUsers = async (req, res) => {
  const { limit = 10, page = 1, orderBy = 'id', orderDir = 'DESC', search = '', status } = req.query;
  
  try {
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    // Filtro por status si se proporciona
    if (status) {
      whereClause.status = status;
    }
    
    // Búsqueda por username si se proporciona
    if (search) {
      whereClause.username = {
        [sequelize.Op.like]: `%${search}%`
      };
    }
    
    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'status'],
      where: whereClause,
      order: [[orderBy, orderDir.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return res.json({
      total: count,
      page: parseInt(page),
      pages: totalPages,
      data: rows
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export default {
  create,
  getUsers,
  findUserById,
  updateUser,
  deleteR,
  activeInactive,
  getPaginatedUsers
}