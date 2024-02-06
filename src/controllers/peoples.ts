import { RequestHandler } from "express";
import * as peoples from "../services/peoples";
import { z } from "zod";
import { decryptMatch } from "../utils/match";


export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const items = await peoples.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });

    if (items) return res.json({ peoples: items });

    return res.json({ erro: 'Ocorreu um erro ao solicitar as pessoas dessa requisição.' });
}

export const getPerson: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const params = {
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    };

    const person = await peoples.getOne(params);

    if (person) return res.json({ peoples: person });

    return res.json({ error: 'Ocorreu um erro ao pesquisar essa pessoa.' });
}

export const createPeople: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const bodySchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) return res.json({ erro: 'Dados inválidos' });

    const data = {
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
        ...body.data
    };

    const newPeople = await peoples.create(data);

    if (newPeople) return res.status(201).json({ peoples: newPeople });

    return res.json({ error: 'Ocorreu um erro ao criar essa pessoa.' });
}

export const updatePeople: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const bodySchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: z.string().optional()
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) return res.json({ error: 'Dados inválidos' });

    const filters = {
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group),
    };

    const updatedPerson = await peoples.update(filters, body.data);

    if (updatedPerson) {
        const personItem = await peoples.getOne({
            id: filters.id,
            id_event: filters.id_event
        });

        return res.json({ peoples: personItem });
    }

    return res.json({ error: 'Ocorreu um erro ao tentar atualizar essa pessoa.' });
}

export const deletePeople: RequestHandler = async (req, res) => {
    const { id, id_event, id_group } = req.params;

    const deletedPerson = await peoples.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });

    if (deletedPerson) return res.json({ peoples: deletedPerson });

    return res.json({ error: 'Ocorreu um erro ao tentar deletar essa pessoa.' });
}

export const searchPerson: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const querySchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
    });

    const query = querySchema.safeParse(req.query);

    if (!query.success) return res.json({ error: 'Dados inválidos' });

    const personItem = await peoples.getOne({
        id_event: parseInt(id_event),
        cpf: query.data.cpf
    });

    if (personItem && personItem.matched) {
        const matchId = decryptMatch(personItem.matched);

        const personMatched = await peoples.getOne({
            id_event: parseInt(id_event),
            id: matchId
        });

        if (personMatched) {
            return res.json({
                person: {
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched: {
                    id: personMatched.id,
                    name: personMatched.name
                }
            });
        }
    }

    return res.json({ error: 'Ocorreu um erro ao pesquisar essa pessoa.' });
}