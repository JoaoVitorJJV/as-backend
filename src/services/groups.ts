import { Prisma, PrismaClient } from "@prisma/client";
import { getOne as getOneEvent } from "./events";

const prisma = new PrismaClient();

//-------------------------------------------------------------------------------------//
//Types
//--------------------------------------------------------------------------------------//

type GroupFilters = { id: number, id_event?: number };
type UpdateFilters = GroupFilters;
type DeleteFilters = { id: number, id_event?: number };;
type GroupsCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data'];
type GroupsUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data'];

//------------------------------------------------------------------------------------//

export const getAll = async (id_event: number) => {
    try {
        return await prisma.eventGroup.findMany({ where: { id_event } });
    } catch (err) { return false; }
}

export const getOne = async (filters: GroupFilters) => {
    try {
        return await prisma.eventGroup.findFirst({ where: filters });

    } catch (err) { return false; }
}

export const add = async (data: GroupsCreateData) => {
    try {
        if (!data.id_event) return false;

        const eventItem = await getOneEvent(data.id_event);

        if (!eventItem) return false;

        return await prisma.eventGroup.create({ data });
    } catch (err) { return false; }
}

export const update = async (filters: UpdateFilters, data: GroupsUpdateData) => {
    try {
        return await prisma.eventGroup.update({ where: filters, data });
    } catch (err) { return false; }
}

export const remove = async (filters: DeleteFilters) => {
    try {
        return await prisma.eventGroup.delete({ where: filters });
    } catch (err) { return false; }
}