import { RequestHandler } from "express";
import { z } from "zod";
import * as auth from "../services/auth";

export const login: RequestHandler = (req, res) => {
    const loginValidation = z.object({
        password: z.string()
    });

    const reqData = loginValidation.safeParse(req.body);

    if (!reqData.success) return res.json({ error: "Dados inválidos" });

    // Validate password and generates token
    if (auth.validatePassowrd(reqData.data.password)) {
        return res.json({
            token: auth.createToken()
        })
    }

    res.status(403);
    res.json({ error: "Unauthorized" });
}

export const validate: RequestHandler = (req, res, next) => {

    if (!req.headers.authorization) return res.status(403).json({ error: 'Unauthorized' });

    const token = req.headers.authorization.split(' ')[1];

    if (!auth.validateToken(token)) return res.status(403).json({ error: 'Unauthorized' });

    next();
}