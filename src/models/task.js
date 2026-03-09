import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Status } from "../constans/index.js";

export const Task = sequelize.define("tasks", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese nombre de la tarea'
            }
        }
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});