import bcrypt from "bcrypt";
import env from "../config/env.js";

export const encriptar = async (text) => {
    try {
        const saltRounds = parseInt(env.bcrypt_salt_rounds);
        return await bcrypt.hash(text, saltRounds);
        
    } catch (error) {
     throw new Error(error)   
    }
}

export const comparar = async (text, hash) => {
    try {
        return await bcrypt.compare(text, hash);
    } catch (error) {
     throw new Error('Error al comparar')   
    }
}
