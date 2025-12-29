const pool = require("../config/db");

async function createUser({ id, fullName, email, passwordHash, role }) {
  const query = `
    INSERT INTO users (id, full_name, email, password_hash, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, full_name, email, role, status, created_at
  `;

  const values = [id, fullName, email, passwordHash, role];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findUserByEmail(email) {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const { rows } = await pool.query(query, [email]);
  return rows[0];
}

async function findUserById(id) {
  const query = `
    SELECT id, full_name, email, role, status, last_login_at, created_at, updated_at
    FROM users
    WHERE id = $1
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function updateUserProfile(id, { fullName, email }) {
  const query = `
    UPDATE users
    SET full_name = $2,
        email = $3,
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, full_name, email, role, status
  `;

  const { rows } = await pool.query(query, [id, fullName, email]);
  return rows[0];
}

async function updateUserPassword(id, passwordHash) {
  const query = `
    UPDATE users
    SET password_hash = $2,
        updated_at = NOW()
    WHERE id = $1
  `;

  await pool.query(query, [id, passwordHash]);
}

async function updateLastLogin(id) {
  const query = `
    UPDATE users
    SET last_login_at = NOW()
    WHERE id = $1
  `;

  await pool.query(query, [id]);
}

async function getAllUsers({ limit, offset }) {
  const query = `
    SELECT id, full_name, email, role, status, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await pool.query(query, [limit, offset]);
  return rows;
}

async function updateUserStatus(id, status) {
  const query = `
    UPDATE users
    SET status = $2,
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, status
  `;

  const { rows } = await pool.query(query, [id, status]);
  return rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserProfile,
  updateUserPassword,
  updateLastLogin,
  getAllUsers,
  updateUserStatus,
};
