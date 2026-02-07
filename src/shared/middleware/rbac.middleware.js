export const requireRole = (role)=>{
    return(req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        if(req.user.role!== role){
            return res.status(403).json({
                message:'Forbidden: insufficient permissions'
            });
        }

        next();
    };
};

export const requireAnyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions'
      });
    }

    next();
  };
};
