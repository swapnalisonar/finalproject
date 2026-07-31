const Contact = require('../models/Contact');

exports.create = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'Name, email and message are required' });

  const contact = await Contact.create({ name, email, phone, subject, message });
  res.status(201).json(contact);
};

exports.list = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};

exports.remove = async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  res.json({ message: 'Message deleted' });
};
