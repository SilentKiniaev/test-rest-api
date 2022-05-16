const path = require('path');
const fs = require('fs');
const { File } = require('../models');

async function upload(req, res) {
    try {
        console.log(req.file);

        const file = await File.create(req.file);
        await req.state.user.addFile(file);

        res.status(201).send();
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
}

async function list(req, res) {
    try {
        const { page = 1, size = 10} = req.query;

        const files = await File.findAll({
            offset: (page - 1) * size,
            limit: size
        });

        console.log(files);

        res.send(files);
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
}

async function deleteFile(req, res) {
    try {
        const { id } = req.params;

        const count = await File.destroy({
            where: {
                id
            }
        });

        if (!count) {
            return res.status(400).send({message: 'File not found'});
        }

        res.send();
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
}

async function getFile(req, res) {
    try {
        const { id } = req.params;

        const file = await File.findByPk(id);

        if (!file) {
            return res.status(400).send({message: 'File not found'});
        }

        res.send(file);
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
}

async function downloadFile(req, res) {
    try {
        const { id } = req.params;

        const file = await File.findByPk(id);

        if (!file) {
            return res.status(400).send({message: 'File not found'});
        }

        res.download(path.join(file.path));
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
}

async function updateFile(req, res) {
    try {
        const { id } = req.params;

        const file = await File.findByPk(id);
        
        console.log(file);

        if (!file) {
            return res.status(400).send({message: 'File not found'});
        }

        const filepath = path.join(file.path);

        file.filename = req.file.filename;
        file.mimetype = req.file.mimetype;
        file.path = req.file.path;
        file.size = req.file.size;
        await file.save();

        if (filepath !== path.join(file.filename)) {
            fs.unlink(filepath);
        }
        
        res.send();
    } catch (e) {
        res.status(e?.status ?? 500).send({ message: e.message });
    }
}

module.exports = {
    upload,
    list,
    deleteFile,
    getFile,
    downloadFile,
    updateFile
}
