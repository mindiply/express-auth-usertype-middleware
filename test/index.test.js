/**
 * Created by bongio on 31/10/2016.
 */

"use strict";

let expect = require('chai').expect


const invalidRequest = {}

const nonAuthenticatedRequest = {
    isAuthenticated : () => false,
}

const validUserRequest = {
    user : {
        _id : "NON_MINDIPLY_USER",
        email : 'test@example.com',
        type : 'local'
    },
    isAuthenticated : () => true,
}

const validMindiplyUserRequest = {
    user : {
        _id : "MINDIPLY_USER",
        email : 'test@mindiply.com',
        type : 'google'
    },
    isAuthenticated : () => true,
}

const validSysAdminMindiplyUserRequest = {
    user : {
        _id : "MINDIPLY_USER",
        email : 'paolo.bongiovanni@mindiply.com',
        type : 'google'
    },
    isAuthenticated : () => true,
}

const createResponseObject = () => {
    let called_end = false
    return {
        statusCode : null,
        end : () => {
            called_end = true
        },
        hasCalledEnd : () => called_end
    }
}

let createNextObject = () => {
    let called_next = false
    return {
        next : () => { called_next = true},
        hasCalledNext: () => called_next
    }
}


const {onlyAuthenticatedUsers, onlyAdminUsers, onlySysAdminUsers} = require('../lib')()

describe('Express auth usertype middleware tests', function () {

    describe('Test Normal authentication', function() {

        it('Should call next for authenticated user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlyAuthenticatedUsers(validUserRequest, res, next_obj.next)
            expect(res.hasCalledEnd()).to.equal(false)
            expect(next_obj.hasCalledNext()).to.equal(true)
        })

        it('Should not call next and send error for unauthenticated user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlyAuthenticatedUsers(nonAuthenticatedRequest, res, next_obj.next)
            expect(res.statusCode).to.equal(403)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })


        it('Should not throw an exception for incorrect request without isAuthenticated', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            let exception_thrown = false
            try {
                onlyAuthenticatedUsers(invalidRequest, res, next_obj.next)
            } catch(err) {
                exception_thrown = true
            }
            expect(exception_thrown).to.equal(false)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

    })


    describe('Test Admin authentication', function() {

        it('Should call next for authenticated admin user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlyAdminUsers(validMindiplyUserRequest, res, next_obj.next)
            expect(res.hasCalledEnd()).to.equal(false)
            expect(next_obj.hasCalledNext()).to.equal(true)
        })

        it('Should not call next and send error for non admin user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlyAdminUsers(validUserRequest, res, next_obj.next)
            expect(res.statusCode).to.equal(403)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

        it('Should not call next and send error for unauthenticated user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlyAdminUsers(nonAuthenticatedRequest, res, next_obj.next)
            expect(res.statusCode).to.equal(403)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

        it('Should not throw an exception for incorrect request without isAuthenticated', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            let exception_thrown = false
            try {
                onlyAdminUsers(invalidRequest, res, next_obj.next)
            } catch(err) {
                exception_thrown = true
            }
            expect(exception_thrown).to.equal(false)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

    })



    describe('Test SysAdmin authentication', function() {

        it('Should call next for authenticated sysadmin user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlySysAdminUsers(validSysAdminMindiplyUserRequest, res, next_obj.next)
            expect(res.hasCalledEnd()).to.equal(false)
            expect(next_obj.hasCalledNext()).to.equal(true)
        })

        it('Should not call next and send error for admin but not sysadmin user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlySysAdminUsers(validMindiplyUserRequest, res, next_obj.next)
            expect(res.statusCode).to.equal(403)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

        it('Should not call next and send error for valud user but not sysadmin user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlySysAdminUsers(validUserRequest, res, next_obj.next)
            expect(res.statusCode).to.equal(403)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

        it('Should not call next and send error for unauthenticated user', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            onlySysAdminUsers(nonAuthenticatedRequest, res, next_obj.next)
            expect(res.statusCode).to.equal(403)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })

        it('Should not throw an exception for incorrect request without isAuthenticated', function() {
            let res = createResponseObject()
            let next_obj = createNextObject()
            let exception_thrown = false
            try {
                onlySysAdminUsers(invalidRequest, res, next_obj.next)
            } catch(err) {
                exception_thrown = true
            }
            expect(exception_thrown).to.equal(false)
            expect(res.hasCalledEnd()).to.equal(true)
            expect(next_obj.hasCalledNext()).to.equal(false)
        })
    })
})
