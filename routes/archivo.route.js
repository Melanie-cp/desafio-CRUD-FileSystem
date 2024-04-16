import path from 'path'
import { Router } from "express";
import { writeFile } from 'fs/promises';
import slugify from 'slugify';

const router = Router()

const __dirname = import.meta.dirname;

// PATH /archivos

router.get('/', (req, res) => {

    // query params query string
    const { success, error } = req.query
    console.log({ success, error })

    return res.render('archivos', { success, error })
});

// crear los archivos
router.post('/crear', async (req, res) => {
    try {
        // req.body
        const { archivo, contenido } = req.body

        if (!archivo || !contenido || !archivo.trim() || !contenido.trim()) {
            return res.status(400).redirect('/archivos?error=todos los campos obligatorios')
        }

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`)
        // crear un archivo
        await writeFile(ruta, contenido)

        return res.status(201).redirect('/archivos?success=se creo el archivo con éxito')
    } catch (error) {
        console.log(error)
        return res.status(500).redirect('/archivos?error=error al crear el archivo')
    }

})

export default router;