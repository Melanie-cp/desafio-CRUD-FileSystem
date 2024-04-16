import { Router } from 'express'
import { services } from '../data/services.data.js';

const router = Router()

// path URL = /services

router.get('/', (req, res) => {
    return res.render('services', { services: services });
});

router.get('/:name', (req, res) => {

    const nameURL = req.params.name
    const service = services.find((item) => item.url === `/services/${nameURL}`)

    if (!service) {
        return res.render('404', { title: "No se encuentra el servicio" })
    }

    return res.render('service', { service })
});

export default router;