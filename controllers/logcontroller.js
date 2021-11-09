const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require("../models");

router.post("/", validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const {id} = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id,
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.get("/", validateJWT, async (req, res) => {
    const {id} = req.user;
    try {
        const query = {
            where: {
                owner_id: id
            }
        };
        const logEntries = await LogModel.findAll(query);
        res.status(200).json(logEntries);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.get("/:logId", validateJWT, async (req, res) => {
    const {logId} = req.params;
    const {id} = req.user;
    try {
        const query = {
            where: {
                id: logId,
                owner_id: id
            }
        };
        const logEntries = await LogModel.findOne(query);
        res.status(200).json(logEntries);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.put("/:logId", validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const logId = req.params.logId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner_id: userId,
        }
    }

    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
    }

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

router.delete("/:logId", validateJWT, async (req, res) => {
    const userId = req.user.id;
    const logId = req.params.logId

    try {
        const query = {
            where: {
                id: logId,
                owner_id: userId,
            }
        }
        await LogModel.destroy(query);
        res.status(200).json({message: "Log entry removed"});
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;