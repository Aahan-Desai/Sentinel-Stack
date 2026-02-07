import { findTenantBySlugs } from './tenant.repository.js';

export const resolveTenant = async (slug) => {
  if (!slug) {
    throw new Error('Tenant slug is required');
  }

  const tenant = await findTenantBySlugs(slug);

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  if (tenant.status !== 'active') {
    throw new Error('Tenant is not active');
  }

  return tenant;
};
