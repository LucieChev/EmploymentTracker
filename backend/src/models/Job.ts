import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface JobAttributes {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  personId: number;
}

interface JobCreationAttributes extends Optional<JobAttributes, 'id'> {}

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: string;
  public company!: string;
  public position!: string;
  public startDate!: Date;
  public endDate!: Date | null;
  public personId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


Job.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isAfterStartDate(value: string) {
          if (value && (this as any).startDate && new Date(value) < new Date((this as any).startDate)) {
            throw new Error("La date de fin ne peut pas être antérieure à la date de début.");
          }
        },
      },
    },
    personId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'persons',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    timestamps: false,
  }
);

export default Job;
