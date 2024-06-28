const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User{
    constructor(id, username, email){
        this.id = id;
        this.username = username;
        this.email = email;
    }

    static async createUser(user) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "insert into users (id, username, email) values (@id, @username, @email)";

        const request = connection.request();
        request.input("username", newUserData.username || null); // Handle optional fields
        request.input("email", newUserData.email || null);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getUserById(result.recordset[0].id);
    }

    static async getAllUsers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = "select * from users";

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
        (row) => new User(row.id, row.username, row.email)
        ); // Convert rows to Book objects
    }

    static async getUserById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Users WHERE id = @id`; // Parameterized query

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
        ? new Book(
            result.recordset[0].id,
            result.recordset[0].username,
            result.recordset[0].email
            )
        : null; // Handle user not found
    }

    static async updateUser(id, updateUser) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE users SET username = @username, email = @email WHERE id = @id`; // Parameterized query

        const request = connection.request();
        request.input("id", id);
        request.input("username", newUserData.username || null); // Handle optional fields
        request.input("email", newUserData.email || null);
    
        await request.query(sqlQuery);
    
        connection.close();
    
        return this.getUserById(id); // returning the updated book data
    }

    static async deleteUser(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM users WHERE id = @id`

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0; 
    }

    static async searchUsers(searchTerm) {
        const connection = await sql.connect(dbConfig);
    
        try {
          const query = `
            SELECT *
            FROM Users
            WHERE username LIKE '%${searchTerm}%'
              OR email LIKE '%${searchTerm}%'
          `;
    
          const result = await connection.request().query(query);
          return result.recordset;
        } catch (error) {
          throw new Error("Error searching users"); // Or handle error differently
        } finally {
          await connection.close(); // Close connection even on errors
        }
    }

    static async getUsersWithBooks() {
        const connection = await sql.connect(dbConfig);
    
        try {
          const query = `
            SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
            FROM Users u
            LEFT JOIN UserBooks ub ON ub.user_id = u.id
            LEFT JOIN Books b ON ub.book_id = b.id
            ORDER BY u.username;
          `;
    
          const result = await connection.request().query(query);
    
          // Group users and their books
          const usersWithBooks = {};
          for (const row of result.recordset) {
            const userId = row.user_id;
            if (!usersWithBooks[userId]) {
              usersWithBooks[userId] = {
                id: userId,
                username: row.username,
                email: row.email,
                books: [],
              };
            }
            usersWithBooks[userId].books.push({
              id: row.book_id,
              title: row.title,
              author: row.author,
            });
          }
    
          return Object.values(usersWithBooks);
        } catch (error) {
          throw new Error("Error fetching users with books");
        } finally {
          await connection.close();
        }
    }
}

module.exports = User;