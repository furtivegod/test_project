// const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = require('../utils/supabaseClient');

// Signup
exports.signup = async (req, res) => {
  const { email, password, role , name} = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({ email, password: hashedPassword, role , name})
    .select('*');
  console.log(data);
  if (error) return res.status(400).json({ error });

  res.json({ data });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, data.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: data.id, email: data.email, role: data.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  console.log(token);
  res.json({ token });
};