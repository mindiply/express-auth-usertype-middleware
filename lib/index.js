/**
 * Created by pfbongio on 31/10/2016.
 */

'use strict'

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


function _returnUnauthrorisedIfNotAuthenticated(req, res) {
    if (!req.isAuthenticated()) {
        _returnUnauthorized(res)
        return true
    }
    return false
}


module.exports = (options = {}) => {

    let isAdminUser = options.isAdminUser || _isMindiplyUser
    let isSysAdminUser = options.isSysAdminUser|| _isMindiplySysAdminUser

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
