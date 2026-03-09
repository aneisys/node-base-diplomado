import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Status } from "../constans/index.js";
import { Task } from "./task.js";
import { encriptar } from "../common/bycript.js";

export const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese username'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese contraseña'
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `El estado debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`
            }
        }
    },
});
User.hasMany(Task, {
    foreignKey: 'userId',
    sourceKey: 'id'
});
Task.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id'
});

User.beforeCreate(async (user) => {
    const hashedPassword = await encriptar(user.password);
    user.password = hashedPassword;
});

User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const hashedPassword = await encriptar(user.password);
        user.password = hashedPassword;
    }
});