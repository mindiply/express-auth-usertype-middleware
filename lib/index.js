/**
 * Created by pfbongio on 31/10/2016.
 */

'use strict'


function _isAuthenticatedUser(req) {
    if (!req || !req.isAuthenticated || typeof req.isAuthenticated !== 'function') return false
    return req.isAuthenticated()
}


const mindiply_email_regex = /@mindiply.com$/i
function _isMindiplyUser(req) {
    if (!mindiply_email_regex.test(req.user.email)) return false
    if (req.user.type !== 'google') return false
    return true
}


function _isMindiplySysAdminUser(req) {
    return ['paolo.bongiovanni@mindiply.com', 'francesco.marcatto@mindiply.com'].indexOf(req.user.email) != -1 && req.user.type === 'google'
}


function _returnUnauthorized(res) {
    res.statusCode = 403
    res.end()
}



const _default_options = {
    isAuthenticatedUser : _isAuthenticatedUser,
    isAdminUser :_isMindiplyUser,
    isSysAdminUser : _isMindiplySysAdminUser
}

module.exports = (options = {}) => {
    if (!options || typeof options !== 'object') throw new Error('Invalid options object provided')
    let merged_options = Object.assign({}, _default_options, options)
    let {isAuthenticatedUser, isAdminUser, isSysAdminUser} = merged_options

    function _returnUnauthrorisedIfNotAuthenticated(req, res) {
        if (!isAuthenticatedUser(req)) {
            _returnUnauthorized(res)
            return true
        }
        return false
    }


    return {

        onlyAuthenticatedUsers: (req, res, next) => {
            if (!_returnUnauthrorisedIfNotAuthenticated(req, res)) next()
        },

        onlyAdminUsers: (req, res, next) => {
            if (_returnUnauthrorisedIfNotAuthenticated(req, res)) return
            if (!isAdminUser(req)) _returnUnauthorized(res)
            else next()
        },

        onlySysAdminUsers: (req, res, next) => {
            if (_returnUnauthrorisedIfNotAuthenticated(req, res)) return
            if (!isSysAdminUser(req)) _returnUnauthorized(res)
            else next()
        }
    }
}
