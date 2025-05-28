import { configDotenv } from "dotenv";
import { AppDataSource } from "../db";
import { User } from "../entities/User";
import { LoginModel } from "../models/login.model";
import { checkIfDefined } from "../utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const repo = AppDataSource.getRepository(User)

configDotenv()
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const accessExpire: number = parseInt(process.env.ACCESS_TOKEN_TTL || "3600", 10);
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshExpire: number = parseInt(process.env.REFRESH_TOKEN_TTL || "604800", 10);

export class UserService {
    static async login(model: LoginModel) {
        console.log("PRIMLJEN", model);
        const user: User = await this.getUserByUsername(model.username)
        console.log("NADJEN", user);
        if (await bcrypt.compare(model.password, user.password)) {
            return {
                username: user.username,
                access: jwt.sign({ name: user.username}, accessSecret as string, {expiresIn: accessExpire}),
                refresh: jwt.sign({ name: user.username }, refreshSecret as string, { expiresIn: refreshExpire })
            };
        }
        throw new Error("BAD_CREDENTIALS");
    }

    public static async refreshToken(refresh: string) {
        try {
            const decoded: any = jwt.verify(refresh, refreshSecret as string)
            return {
                username: decoded.name,
                access: jwt.sign({ name: decoded.name }, accessSecret, { expiresIn: accessExpire }),
                refresh: refresh
            }
        } catch (err) {
            throw new Error('REFRESH_FAILED')
        }
    }

    static async getUserByUsername(username: string) {
        const data = await repo.findOne({
            where: {
                active: true,
                username: username
            }
        })
        return checkIfDefined(data)
    }
}