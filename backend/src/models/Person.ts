import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Job from './Job';

interface PersonAttributes {
  id: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
}

interface PersonCreationAttributes extends Optional<PersonAttributes, 'id'> {}

class Person extends Model<PersonAttributes, PersonCreationAttributes> implements PersonAttributes {
  public id!: string;
  public firstname!: string;
  public lastname!: string;
  public birthdate!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Person.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },

    },
  },
  {
    sequelize,
    modelName: 'Person',
    tableName: 'persons',
  }
);

Person.hasMany(Job, { foreignKey: 'personId', as: 'jobs' });
Job.belongsTo(Person, { foreignKey: 'personId', as: 'person' });

export default Person;
