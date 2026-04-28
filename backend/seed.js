require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Task } = require('./models');

const users = [
  {
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    password: 'arjun123',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'priya123',
  },
];

const taskSets = [
  [
    { title: 'Set up project repository', description: 'Initialize git, add .gitignore and push to GitHub', status: 'completed' },
    { title: 'Design database schema', description: 'Finalize users and tasks table with proper relationships', status: 'completed' },
    { title: 'Build authentication API', description: 'Register, login endpoints with JWT and bcrypt', status: 'completed' },
    { title: 'Write task CRUD endpoints', description: 'GET, POST, PUT, DELETE for /api/tasks', status: 'completed' },
    { title: 'Connect frontend to backend', description: 'Set up axios instance with interceptors and auth headers', status: 'pending' },
    { title: 'Deploy backend to Render', description: 'Set environment variables and test the live API', status: 'pending' },
    { title: 'Deploy frontend to Vercel', description: 'Set VITE_API_URL to production backend URL', status: 'pending' },
  ],
  [
    { title: 'Buy groceries', description: 'Milk, eggs, bread, butter and vegetables for the week', status: 'completed' },
    { title: 'Call doctor for appointment', description: 'Schedule annual health checkup', status: 'completed' },
    { title: 'Pay electricity bill', description: 'Due date is 30th — pay online via UPI', status: 'pending' },
    { title: 'Read Clean Code chapter 4', description: 'Functions and how to write readable code', status: 'pending' },
    { title: 'Morning run — 5km', description: 'Track on Google Fit, target under 32 minutes', status: 'pending' },
    { title: 'Review pull request from team', description: 'Check the new authentication changes on branch feature/auth-v2', status: 'pending' },
  ],
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    await Task.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('Cleared existing data');

    for (let i = 0; i < users.length; i++) {
      const hashed = await bcrypt.hash(users[i].password, 12);
      const user = await User.create({
        name: users[i].name,
        email: users[i].email,
        password: hashed,
      });

      for (const task of taskSets[i]) {
        await Task.create({ ...task, userId: user.id });
      }

      console.log(`Created user: ${user.email} (password: ${users[i].password}) with ${taskSets[i].length} tasks`);
    }

    console.log('\nSeed complete. Login with:');
    console.log('  Email: arjun@example.com   Password: arjun123');
    console.log('  Email: priya@example.com   Password: priya123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
