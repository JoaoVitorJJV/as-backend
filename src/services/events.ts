import { Prisma, PrismaClient } from "@prisma/client"
import * as peoples from "../services/peoples";
import * as groups from "../services/groups";
import * as matches from "../utils/match";

const prisma = new PrismaClient();

//-------------------------------------------------------------------------------------//
//Types
//--------------------------------------------------------------------------------------//

type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data'];
type EventsUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data'];

type SortedList = { id: number, match: number };

//------------------------------------------------------------------------------------//

export const getAll = async () => {
    try {
        return await prisma.event.findMany();
    } catch (err) {
        return false;
    }
}

export const getOne = async (id: number) => {
    try {
        return await prisma.event.findFirst({
            where: {
                id
            }
        })
    } catch (err) { return false; }
}

export const add = async (data: EventsCreateData) => {
    try {
        return await prisma.event.create({ data });
    } catch (err) { return false; }
}

export const update = async (id: number, data: EventsUpdateData) => {
    try {
        return await prisma.event.update({
            where: { id },
            data
        })
    } catch (err) { return false; }
}

export const remove = async (id: number) => {
    try {
        return await prisma.event.delete({ where: { id } })
    } catch (err) { return false; }
}

export const doMatches = async (id: number): Promise<boolean> => {
    // Dados do sorteio
    const eventItem = await prisma.event.findFirst({ where: { id }, select: { grouped: true } });

    if (eventItem) {
        // Lista de pessoas
        const peoplesList = await peoples.getAll({ id_event: id });

        if (peoplesList) {
            // Lista final de pessoas sorteadas
            let sortedList: SortedList[] = [];

            // Pessoas aptas a serem sorteadas
            let sortable: number[] = [];

            let attemps = 0;
            const maxAttemps = peoplesList.length;
            let keepTrying = true;

            while (keepTrying && attemps < maxAttemps) {
                // Fazer o sorteio
                keepTrying = false;
                attemps++;
                sortedList = [];
                sortable = peoplesList.map(person => person.id);

                for (let personItem of peoplesList) {
                    let sortableFiltered: number[] = sortable;

                    if (eventItem.grouped) {
                        sortableFiltered = sortable.filter(sortableItem => {
                            let sortablePerson = peoplesList.find(person => person.id === sortableItem);
                            return personItem.id_group !== sortablePerson?.id_group;
                        })
                    }

                    // Em caso de não achar ninguém
                    if (sortableFiltered.length === 0 || (sortableFiltered.length == 1 && personItem.id == sortableFiltered[0])) {
                        keepTrying = true;
                    } else {
                        // Sorteio
                        let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);

                        // Em caso de o index ser a pessoa da iteração
                        while (sortableFiltered[sortedIndex] === personItem.id) {
                            sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                        }

                        sortedList.push({
                            id: personItem.id,
                            match: sortableFiltered[sortedIndex]
                        });

                        // Remover das pessoas aptas a serem sorteadas
                        sortable = sortable.filter(sortableItem => sortableItem !== sortableFiltered[sortedIndex]);
                    }
                }
            }

            if (attemps < maxAttemps) {
                for (let i in sortedList) {
                    await peoples.update({
                        id: sortedList[i].id,
                        id_event: id
                    }, { matched: matches.enctryptMatch(sortedList[i].match) });
                }
            }
        }

    }

    return true;
}