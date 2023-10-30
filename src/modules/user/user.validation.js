import Joi from 'joi'

export const createUserSchema = Joi.object({
    name: Joi.string().min(2).max(30).required()
})

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    id: Joi.string().hex().length(24).required()
})