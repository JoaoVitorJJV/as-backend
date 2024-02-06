import { Prisma, PrismaClient } from "@prisma/client";
import { getOne as getOneGroup } from "./groups";

//-------------------------------------------------------------------------------------//
//Types
//--------------------------------------------------------------------------------------//

type GetAllFilters = { id_event: number, id_group?: number };
type GetPersonFilters = {
    id_event: number,
    id_group?: number,
    id?: number,
    cpf?: string
};
type CreatePeople = Prisma.Args<typeof prisma.eventPeople, 'create'>['data'];
type UpdatePeople = Prisma.Args<typeof prisma.eventPeople, 'update'>['data'];
type UpdateFilters = { id?: number, id_event: number, id_group?: number };
type DeleteFilters = { id: number, id_event?: number, id_group?: number };
type SearchFlters = { id_event: number, cpf: string };

//------------------------------------------------------------------------------------//

const prisma = new PrismaClient();

export const getAll = async (filters: GetAllFilters) => {
    try {
        return await prisma.eventPeople.findMany({ where: filters });
    } catch (err) { return false; }
}

export const getOne = async (filters: GetPersonFilters) => {
    try {

        if (!filters.cpf && !filters.id) return false;

        return await prisma.eventPeople.findFirst({ where: filters });
    } catch (err) { return false; }
}

export const create = async (data: CreatePeople) => {
    try {
        if (!data.id_group) return false;

        const group = await getOneGroup({
            id: data.id_group,
            id_event: data.id_event
        });

        if (!group) return false;

        return await prisma.eventPeople.create({ data });
    } catch (err) { return false; }
}

export const update = async (filters: UpdateFilters, data: UpdatePeople) => {
    try {
        return await prisma.eventPeople.updateMany({ where: filters, data });
    } catch (err) { return false };
}

export const remove = async (filters: DeleteFilters) => {
    try {
        return await prisma.eventPeople.delete({ where: filters });
    } catch (err) { return false };
}

// export const search = async (filters: SearchFlters) => {
//     try {
//         return prisma.eventPeople.findFirst({ where: filters });
//     } catch (err) { return false };
// }