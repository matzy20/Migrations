# What are Migrations
Just like how we use Git to version control source code, we use migrations to manage the state of our database schemas.

## I'm not really sure what that means...
Imagine you're working on project with another developer, and you're both tasked with creating a specific part of an event planning application. Let's say you are in charge of creating the `Users` and your friend is going to create the `Events`.

Let's say you and your friend divided the work in a way so that neither of you will have to to use each other's code to finish your tasks. While you're working on your part of the application, you only really need to touch the `Users` table when you are working with the database.

# Creating models and migrations

Using `sequelize-cli` you can easily create and manage your models and migrations. It has a useful command called `model:create`, which will generate 2 files for you: a __model__ file and a corresponding __migration__ file.

It has a couple handy options so that you can create your schemas from the command line:

__Example Usage__
```
sequelize model:create --name User --attributes first_name:string,last_name:string,bio:text
```

Notice the `--name` and `--attributes` _flags_. these let us tell the program that we want to create a new model called `User`, that has 3 properties and their types:
  - `first_name`, type: `string`
  - `last_name`, type: `string`
  - `bio`, type: `text`

For a list of all the valid data types Sequelize has to offer, see: http://docs.sequelizejs.com/en/latest/api/datatypes/

This will generate 2 files for you:
**models/User.js**
```
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
```

**migrations/<timestamp>-create-user.js**
```
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};
```

Let's take a look at the migration file. If you look carefully at the name of the file, it will have the _timestamp_ of when the migration file was created. This is on purpose so that sequelize can run the older migration files first, and then the newer ones that build on top of them. This is important later when changes need to be made to the database.

Also, it's guaranteed that your models and your migrations match. The migration files keep track of the state of the database schemas, and should always be created when changes to your models are made. Always commit coresponding migration files when changes to your models are made.

For a list of migration functions, see: http://sequelize.readthedocs.org/en/latest/docs/migrations/

## Woops! Forgot a something...

Let's pretend you have jammed out 50 new commits while working with your newly created `Users` table, merged in your friends `Events`, and realize that you forgot to add in an `email` column to the table! Don't worry, this is not a problem.

```
sequelize create:migration --name add-email-to-user
```

This time you run the command, it only generates a migration file for you. When you open it, you notice it's pretty bare!

**migrations/<timestamp>-add-email-to-user.js
```
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

```

But, because you're awesome and read the documentation, you know sequelize migrations has an `addColumn` function that will fix the problem for you!

After filling in the `up` and `down` functions, your migration file looks like this:

```
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn( 'Users', 'email', Sequelize.STRING );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn( 'Users', 'email' );
  }
};
```

It's important to always have both `up` and `down` methods in your migration script. Every time you run `sequelize db:migrate` it will call the `up` method. And if you ever want to _revert_ backwards, you can call `sequelize db:migrate:undo` which will call the `down` method. They should always be opposite actions, this allows you to safely run migrations and know that the state of the database will be intact.

## Not so fast! Update your model too!
Now that you fixed your migrations, you need to update your model to reflect the changes.

**models/user.js**
```
'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    bio: DataTypes.TEXT,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
```
Secret read unlocked! Validations: http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations

Now if you run migrations, it will update your table to have emails as well!

```
sequelize_express=# SELECT * FROM "Users";
 id | first_name | last_name | bio | createdAt | updatedAt | email 
----+------------+-----------+-----+-----------+-----------+-------
(0 rows)

```
