import { Router } from "express";
import * as auth from "../controllers/auth";
import * as events from "../controllers/events"
import * as groups from "../controllers/groups"
import * as peoples from "../controllers/peoples"

const router = Router();

router.post('/login', auth.login);

//-------------------------------------------------------------------------------------//
//Middleware: Validate
//--------------------------------------------------------------------------------------//

router.get('/ping', auth.validate, (req, res) => res.json({ pong: true, admin: true }))

//-------------------------------------------------------------------------------------//
//Events
//--------------------------------------------------------------------------------------//
router.get('/events', auth.validate, events.getAll);
router.get('/events/:id', auth.validate, events.getEvent);
router.post('/events', auth.validate, events.addEvent);
router.put('/events/:id', auth.validate, events.updateEvent);
router.delete('/events/:id', auth.validate, events.deleteEvent);

//-------------------------------------------------------------------------------------//
//Groups
//--------------------------------------------------------------------------------------//
router.get('/events/:id_event/groups', auth.validate, groups.getAll);
router.get('/events/:id_event/groups/:id', auth.validate, groups.getGroup);
router.post('/events/:id_event/groups', auth.validate, groups.addGroup);
router.put('/events/:id_event/groups/:id', auth.validate, groups.updateGroup);
router.delete('/events/:id_event/groups/:id', auth.validate, groups.deleteGroup);

//-------------------------------------------------------------------------------------//
//Peoples
//--------------------------------------------------------------------------------------//
router.get('/events/:id_event/groups/:id_group/peoples', auth.validate, peoples.getAll);
router.get('/events/:id_event/groups/:id_group/peoples/:id', auth.validate, peoples.getPerson);
router.post('/events/:id_event/groups/:id_group/peoples', auth.validate, peoples.createPeople);
router.put('/events/:id_event/groups/:id_group/peoples/:id', auth.validate, peoples.updatePeople);
router.delete('/events/:id_event/groups/:id_group/peoples/:id', auth.validate, peoples.deletePeople);


export default router

