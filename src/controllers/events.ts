import { RequestHandler } from "express";
import * as events from "../services/events"
import * as peoples from "../services/peoples"
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
    const items = await events.getAll();

    if (items) return res.json({ events: items })


    return res.json({ error: 'Nenhum evento encontrado. ' });
}


export const getEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const event = await events.getOne(parseInt(id));

    if (event) return res.json({ event });

    return res.json({ error: 'Ocorreu um erro' });
}


export const addEvent: RequestHandler = async (req, res) => {
    const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    })

    const body = bodySchema.safeParse(req.body);

    if (!body.success) return res.json({ error: 'Dados inválidos' });

    const newEvent = await events.add(body.data);

    if (newEvent) return res.json({ event: newEvent });

    return res.json({ error: 'Ocorreu um erro' });
}

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const bodySchema = z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional(),
        status: z.boolean().optional()
    });

    const body = bodySchema.safeParse(req.body);

    if (!body.success) return res.json({ error: 'Dados inválidos' });

    const updatedEvent = await events.update(parseInt(id), body.data);

    if (updatedEvent) {

        if (updatedEvent.status) {
            const result = await events.doMatches(parseInt(id));

            if (!result) return res.json({ error: 'Não é possível sortear esse grupo.' });
        } else {
            await peoples.update({ id_event: parseInt(id) }, { matched: "" });
        }

        return res.json({ event: updatedEvent });
    }

    return res.json({ error: 'Ocorreu um erro' });
}

export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const deletedEvent = await events.remove(parseInt(id));

    if (deletedEvent) return res.json({ event: deletedEvent });

    return res.json({ error: 'Ocorreu um erro ao deletar o evento' });
}