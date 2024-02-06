import { RequestHandler } from "express";
import * as groups from "../services/groups";
import { z } from "zod";


export const getAll: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const items = await groups.getAll(parseInt(id_event));

    if (items) return res.json({ groups: items });

    return res.json({ error: 'Ocorreu um erro ao recuperar os groups desse evento. ' });
}

export const getGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;

    const item = await groups.getOne({ id_event: parseInt(id_event), id: parseInt(id) });

    if (item) return res.json({ group: item });

    return res.json({ error: 'Esse evento não possui esse grupo.' });
}

export const addGroup: RequestHandler = async (req, res) => {

    const bodySchema = z.object({
        name: z.string()
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) return res.json({ error: 'Dados Inválidos' });

    const data = {
        ...body.data,
        id_event: parseInt(req.params.id_event)
    }

    const newGroup = await groups.add(data);

    if (newGroup) return res.status(201).json({ group: newGroup });

    return res.json({ error: 'Ocorreu um erro ao criar esse groupo' });
}

export const updateGroup: RequestHandler = async (req, res) => {
    const { id, id_event } = req.params;
    const filters = {
        id: parseInt(id),
        id_event: parseInt(id_event)
    }

    const bodySchema = z.object({
        name: z.string().optional()
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) return res.json({ error: 'Dados Inválidos' });

    const updatedGroup = await groups.update(filters, body.data);

    if (updatedGroup) return res.json({ group: updatedGroup });

    return res.json({ error: 'Ocorreu um erro' });
}

export const deleteGroup: RequestHandler = async (req, res) => {
    const { id_event, id } = req.params;

    const deletedGroup = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });

    if (deletedGroup) return res.json({ group: deletedGroup });

    return res.json({ error: 'Ocorreu um erro' });
}