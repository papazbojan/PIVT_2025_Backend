import { Router } from "express"
import { ManufacturerService } from "../services/manufacturer.service"
import { handleRequest } from "../utils"

export const ManufacturerRoute = Router()

ManufacturerRoute.get('/', (req, res) => {
    handleRequest(res, ManufacturerService.getAllManufacturers())
})

ManufacturerRoute.get('/:id', (req, res) => {
    const id = req.params.id as any as number
    handleRequest(res, ManufacturerService.getManufacturerById(id))
})

ManufacturerRoute.post('/', (req, res) => {
    handleRequest(res, ManufacturerService.createManufacturer(req.body))
})

ManufacturerRoute.put('/:id', (req, res) => {
    const id = req.params.id as any as number
    handleRequest(res, ManufacturerService.updateManufacturer(id, req.body))
})

ManufacturerRoute.delete('/:id', (req, res) => {
    const id = req.params.id as any as number
    handleRequest(res, ManufacturerService.deleteManufacturerById(id))
})