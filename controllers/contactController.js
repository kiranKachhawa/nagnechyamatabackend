const Contact = require("../models/contact");

exports.createContact = async (req, res) => {

    try {

        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};