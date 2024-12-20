const Task = require("../models/Task");
const User = require("../models/User");
const { validateObjectId } = require("../utils/validation");
const {sendMail} = require('../utils/nodemailer');
const Queue = require('bull');
const emailQueue = new Queue('emailQueue');

// Process jobs
emailQueue.process(async (job) => {
  const { email, subject, body } = job.data;
  // Implement your email sending logic here
  sendMail(email, subject, body);
});

// Get all tasks for the user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate("user");
    res
      .status(200)
      .json({ tasks, status: true, msg: "Tasks found successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    const task = await Task.findOne({
      user: req.user.id,
      _id: req.params.taskId,
    }).populate("user");
    if (!task) {
      return res.status(404).json({ status: false, msg: "No task found" });
    }
    res
      .status(200)
      .json({ task, status: true, msg: "Task found successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// Create a new task
exports.postTask = async (req, res) => {
  try {
    const { description, tillDate, atWhatTime } = req.body;

    if (!description || !tillDate || !atWhatTime) {
      return res.status(400).json({
        status: false,
        msg: "All fields (description, tillDate, atWhatTime) are required",
      });
    }

    const task = await Task.create({
      user: req.user.id,
      description,
      tillDate: new Date(tillDate),
      atWhatTime,
    });

    const targetDate = new Date(task.tillDate);
    const [hours, minutes] = atWhatTime.split(":").map(Number);
    targetDate.setHours(hours, minutes, 0, 0);

    const currentTime = Date.now();
    const timeout = targetDate.getTime() - currentTime;

    if (timeout > 0) {
      const USER = await User.findById(req.user.id);
      const email = USER.email;
      const emailBody = `<html>${description} is pending</html>`;

      // Schedule the email using Bull
      emailQueue.add(
        { email, subject: `${description} Pending`, body: emailBody },
        { delay: timeout }
      );
    }

    res.status(200).json({ task, status: true, msg: "Task created successfully.." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};


exports.putTask = async (req, res) => {
  try {
    const { description, tillDate, atWhatTime } = req.body;

    if (!description || !tillDate || !atWhatTime) {
      return res
        .status(400)
        .json({
          status: false,
          msg: "All fields (description, tillDate, atWhatTime) are required",
        });
    }

    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, msg: "Task with given ID not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          status: false,
          msg: "You cannot update a task that doesn't belong to you",
        });
    }

    task.description = description;
    task.tillDate = new Date(tillDate);
    task.atWhatTime = atWhatTime;

    const targetDate = new Date(task.tillDate);

    // Split the time (atWhatTime) into hours and minutes, assuming it's in the format 'HH:mm'
    const [hours, minutes] = atWhatTime.split(":").map(Number);

    // Set the time on the targetDate
    targetDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, and reset seconds and milliseconds
    const currentTime = Date.now();
    const timeout = targetDate.getTime() - currentTime;
    const USER = await User.findById(task.user);
    const email = USER.email;
    const emailBody = `<html></html>`

    setTimeout(() => {
      if(!email) return;
      sendMail(email, `${description} Pending`, emailBody);
    }, timeout);

    await task.save();
    res
      .status(200)
      .json({ task, status: true, msg: "Task updated successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.markTaskComplete = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!validateObjectId(taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ status: false, msg: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          status: false,
          msg: "You cannot modify a task that doesn't belong to you",
        });
    }

    task.status = "completed";
    await task.save();
    res
      .status(200)
      .json({ task, status: true, msg: "Task marked as complete" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ status: false, msg: "Task ID not valid" });
    }

    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, msg: "Task with given ID not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          status: false,
          msg: "You cannot delete a task that doesn't belong to you",
        });
    }

    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ status: true, msg: "Task deleted successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
