# express-auth-usertype-middleware

Simple middleware that returns a 403 error when a user is not authenticated to the required level of security.

The library offers three levels of check: authenticated users, admin users and sysadmin users.


# Usage

~~~

function isReqAuthenticated(req) { ... }
function isReqAdminAuthenticated(req) { ... }
function isReqSysAdminAuthenticated(req) { ... }

let { onlyAuthenticatedUsers, onlyAdminUsers, onlySysAdminUsers } = 
    require('@bongione/express-auth-usertype-middleware')({
        isAuthenticatedUser : isReqAuthenticated,
        isAdminUser : isReqAdminAuthenticated,
        isSysAdminUser : isReqSysAdminAuthenticated
    })    
    
app.use('/my_protected_routes', onlyAuthenticatedUsers, protected_routes_router)
app.use('/my_admin_routes', onlyAdminUsers, admin_routes_router)
app.use('/my_sysadmin_routes', onlySysAdminUsers, sysadmin_routes_router)
~~~


The default implementation of *isAuthenticatedUser* uses the passport
req.isAuthenticated function.
 
The default implementations of isAdminUser and isSysAdminUser instead are
specific to Mindiply and ought to be customized.
  

# License

Apache 2.0