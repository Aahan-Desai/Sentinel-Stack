import { Tenant } from './tenant.model.js';

export const findTenantBySlugs = async(slug)=>{
    return Tenant.findOne({slug});
};
