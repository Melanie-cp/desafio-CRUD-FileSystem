import path from 'path'
import { Router } from "express";
import { readFile, rename, writeFile, unlink } from 'fs/promises';
import slugify from 'slugify'

const router = Router()

const __dirname = import.meta.dirname;

// PATH /archivos

router.get('/', (req, res) => {

    // query params query string
    const { success, error } = req.query

    return res.render('archivos', { success, error })
})

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

router.get('/leer', async (req, res) => {
    try {
        const { archivo } = req.query

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`)
        const contenido = await readFile(ruta, 'utf-8')

        return res.redirect('/archivos?success=' + contenido)
    } catch (error) {
        console.log(error)
        if (error.code === 'ENOENT') {
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo')
        }
        return res.status(500).redirect('/archivos?error=error al leer el archivo')
    }
})

router.post('/renombrar', async (req, res) => {
    try {

        const { archivo, nuevoNombre } = req.body

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const nuevoSlug = slugify(nuevoNombre, {
            trim: true,
            lower: true,
            strict: true
        })

        const viejaRuta = path.join(__dirname, `../data/archivos/${slug}.txt`)
        const nuevaRuta = path.join(__dirname, `../data/archivos/${nuevoSlug}.txt`)

        await rename(viejaRuta, nuevaRuta)

        return res.status(200).redirect('/archivos?success=se renombró con éxito el archivo')
    } catch (error) {
        console.log(error)
        if (error.code === 'ENOENT') {
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo')
        }
        return res.status(500).redirect('/archivos?error=error al leer el archivo')
    }
})

//eliminar archivo
router.post('/eliminar', async (req, res) => {
    try {
        const { archivo } = req.body;

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        });

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);

        await unlink(ruta);

        return res.status(200).redirect('/archivos?success=se eliminó el archivo con éxito');
    } catch (error) {
        console.log(error);
        if (error.code === 'ENOENT') {
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo');
        }
        return res.status(500).redirect('/archivos?error=error al eliminar el archivo');
    }
});

export default router;