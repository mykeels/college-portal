# College-Portal Backend

For now, all we have are migration scripts for our user-and-roles systems

### How to use

- Create an SQL DB on your system and give it a name like `college-portal`

- Copy the `.env.example` file to `.env`, and specify the values for connecting to the DB you just created

- Open the terminal and be sure to be in the `./src` directory

- `npm install`

- `npm run migrate` should create the tables and relationships in your DB

### Testing

- Test scripts should be in the format: `<script-name>.test.js`

- Run `npm test` in your terminal to run the tests, to guide you when modifying code