import { resolveTenant } from "../../modules/tenants/tenant.service.js";

export const tenantMiddleware = async (req, res, next) => {
  try {
    console.log("RAW TENANT HEADER:", req.headers["x-tenant-slug"]);

    const tenantSlug = req.headers["x-tenant-slug"]?.toString().toLowerCase().trim();

    if (!tenantSlug) {
      return res.status(400).json({
        error: "Tenant resolution failed",
        message: "x-tenant-slug header is missing",
      });
    }

    const tenant = await resolveTenant(tenantSlug);

    req.tenant = {
      id: tenant._id,
      slug: tenant.slug,
    };

    next();
  } catch (error) {
    res.status(400).json({
      error: "Tenant resolution failed",
      message: error.message,
    });
  }
};
