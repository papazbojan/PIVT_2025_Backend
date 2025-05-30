import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Type } from "../entities/Type";
import { NameModel } from "../models/name.model";
import { checkIfDefined } from "../utils";

const repo = AppDataSource.getRepository(Type)

export class TypeService {
    static async getAllTypes() {
        return await repo.find({
            select: {
                typeId: true,
                name: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                deletedAt: IsNull()
            }
        })
    }

    //OVO ISPOD JE DODATO - Ovo trazi po tom ID-u
    static async getTypeById(id: number) {
        const data = await repo.findOne({
            select: {
                typeId: true,
                name: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                typeId: id,
                deletedAt: IsNull()
            }
        })

        return checkIfDefined(data)
    }
//MODEL ZA KREIRANJE
    static async createType(model: NameModel) {
        return await repo.save({
            name: model.name,
            createdAt: new Date()
        })
    }
//MODEL ZA EDITOVANJE
    static async updateType(id: number, model: NameModel) {
        const data = await this.getTypeById(id)
        data.name = model.name
        data.updatedAt = new Date()

        return await repo.save(data)
    }
//MODEL ZA BRISANJE
    static async deleteTypeById(id: number) {
        const data = await this.getTypeById(id)
        data.deletedAt = new Date()
        await repo.save(data)
    }
}