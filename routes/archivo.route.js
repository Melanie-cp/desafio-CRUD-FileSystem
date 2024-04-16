import path from 'path'
import { Router } from "express";
import { readFile, rename, writeFile, unlink } from 'fs/promises';
import slugify from 'slugify'

const router = Router()

const __dirname = import.meta.dirname;

// Función para obtener la fecha actual en formato dd/mm/yyyy
function obtenerFechaActual() {
    const fecha = new Date();
    const dia = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
    const mes = (fecha.getMonth() + 1) < 10 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
}

// PATH /archivos

router.get('/', (req, res) => {
    const { success, error } = req.query

    return res.render('archivos', { success, error })
})

// crear los archivos
router.post('/crear', async (req, res) => {
    try {
        const { archivo, contenido } = req.body

        if (!archivo || !contenido || !archivo.trim() || !contenido.trim()) {
            return res.status(400).redirect('/archivos?error=todos los campos obligatorios')
        }

        const slug = slugify(archivo, {
            trim: true,
            lower: true,
            strict: true
        })

        const fechaActual = obtenerFechaActual();
        const nuevoNombreArchivo = `${fechaActual}-${slug}.txt`;

        const ruta = path.join(__dirname, `../data/archivos/${nuevoNombreArchivo}`);

        // Escribir el contenido en el archivo
        await writeFile(ruta, contenido);

        return res.status(201).redirect('/archivos?success=se creo el archivo con éxito');
    } catch (error) {
        console.log(error)
        return res.status(500).redirect('/archivos?error=error al crear el archivo')
    }

})

//leer archivos
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

// renombrar archivos
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

        return res.status(200).redirect(`/archivos?success=se renombró con éxito el archivo ${slug} a: ${nuevoSlug}`)
    } catch (error) {
        console.log(error)
        if (error.code === 'ENOENT') {
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo')
        }
        return res.status(500).redirect('/archivos?error=error al leer el archivo')
    }
})

//eliminar archivos
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