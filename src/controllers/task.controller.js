import { Task } from "../models/task.js";
import logger from "../logs/logger.js";
import { Status } from "../constans/index.js";
import { sequelize } from "../database/database.js";

async function create(req, res) {
  const { name } = req.body;
  const { userId } = req.user;
  try {
    const newTask = await Task.create({
      name,
      userId
    })
    return res.status(201).json(newTask);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
}

async function getTasks(_req, res) {
  const { userId } = req.user;
  try {
    const tasks = await Task.findAndCountAll({
      attributes: ['id', 'name', 'done'],
      order: [['id', 'DESC']],
      where: {
        userId
      }
    });
    return res.json({
      total: tasks.count,
      data: tasks.rows
    });
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
}

async function findTaskById(_req, res) {
  const { id } = _req.params;
  const { userId } = _req.user;
  try {
    const task = await Task.findOne({
      attributes: [ 'name', 'done'],
      where: {
        id,
        userId
      }
    });
    if (!task) {
      return res.status(404).json({ message: 'Task no encontrado' });
    }
    return res.json(task);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
  
}

const updateTask = async (_req, res) => {
  const { id } = _req.params;
  const { userId } = _req.user;
  const { name } = _req.body;
  if (!name) return res.status(400).json({ message: 'No existe la tarea' });
  try {
    const task = await Task.update(
      {
        name
      },
      {
        where: {
          id,
          userId
        }
      }
    );
    if(task[0] === 0) {
      return res.status(404).json({ message: 'Task no encontrado' });
    }
    return res.json(task);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
  
}

const done = async (_req, res) => {
  const { id } = _req.params;
  const { userId } = _req.user;
  const { done } = _req.body;

  try {
    const task = await Task.update(
      {
        done
      },
      {
        where: {
          id,
          userId
        }
      }
    );
    if(task[0] === 0) {
      return res.status(404).json({ message: 'Task no encontrado' });
    }
    return res.json(task);
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
  
}

const deleteTask = async (_req, res) => {
  const { id } = _req.params;
  const { userId } = _req.user;
  try {
    const task = await Task.destroy({
      where: {
        id,
        userId
      }
    });
    if(task === 0) {
      return res.status(404).json({ message: 'Task no encontrado' });
    }
    return res.json({ message: 'Task eliminado' });
  } catch (error) {
    logger.error(error)
    return res.json(error)
  }
}

export default {
  create,
  getTasks,
  findTaskById,
  updateTask,
  deleteTask,
  done
}