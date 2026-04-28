const { Task } = require('../models');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      task.status = status;
    }

    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
