
import { Router } from "express"
import { validate } from "../../library/middlewares/validation"
import { authenticateToken } from "../../library/middlewares/authentication"
import { getCategoriesByServiceSchema, getProviderUsersByServiceSchema, getServiceSchema, getSkillsByServiceSchema, patchProvideServiceSchema, patchServiceCancelationSchema, patchServiceFinalizationSchema, patchServiceRateSchema, postServiceSchema } from "../../library/schemas/services"
import { getServiceCategories, getServiceProviderUsers, getServices, getServiceSkills, patchServiceCancelation, patchServiceFinalization, patchServiceProviders, patchServiceRate, postService } from "../controllers/services"

export default function (router: Router) {
    
    router.get("/service", validate(getServiceSchema, 'query'), authenticateToken('default'), getServices)

    router.get("/service/skills", validate(getSkillsByServiceSchema, 'query'), authenticateToken('default'), getServiceSkills)

    router.get("/service/categories", validate(getCategoriesByServiceSchema, 'query'), authenticateToken('default'), getServiceCategories)

    router.get("/service/providerUsers", validate(getProviderUsersByServiceSchema, 'query'), authenticateToken('default'), getServiceProviderUsers)

    router.post("/service", validate(postServiceSchema, 'body'), authenticateToken('default'), postService)

    router.patch("/service/provide", validate(patchProvideServiceSchema, 'body'), authenticateToken('default'), patchServiceProviders)

    router.patch("/service/finalize", validate(patchServiceFinalizationSchema, 'body'), authenticateToken('default'), patchServiceFinalization)

    router.patch("/service/cancel", validate(patchServiceCancelationSchema, 'body'), authenticateToken('default'), patchServiceCancelation)

    router.patch("/service/rate", validate(patchServiceRateSchema, 'body'), authenticateToken('default'), patchServiceRate)

}
