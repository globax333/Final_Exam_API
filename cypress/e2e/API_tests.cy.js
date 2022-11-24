/// <reference types="Cypress" />
import user from "../../cypress/fixtures/user.json"
import user2 from "../../cypress/fixtures/user2.json"
import header from "../../cypress/fixtures/header.json"
import { faker } from '@faker-js/faker'


user.id = parseInt(faker.random.numeric(3));
user.email = faker.internet.email(10);
user.password = faker.internet.password(10);
user2.id = parseInt(faker.random.numeric(3));
user2.email = faker.internet.email(10);
user2.password = faker.internet.password(10);




it('Get all posts. Verify HTTP response status code.', () => {
    cy.request({
        method: 'GET',
        url: '/posts/',
    }).then(response => {
        expect(response.status).to.be.eq(200)
    })
})

it('Get all posts. Verify content type.', () => {
    cy.request({
        method: 'GET',
        url: '/posts/',
    }).as('posts')
    cy.get('@posts').its('headers').its('content-type')
        .should('include', 'application/json; charset=utf-8')
})

it('Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
    cy.request({
        method: 'GET',
        url: '/posts?_limit=10'
    }).then(response => {
        expect(response.status).to.be.eq(200)
        expect(response.body).to.have.length(10)
    })
})
it('Get posts with id = 55 Verify HTTP response status code. Verify id values of returned records.', () => {
    cy.request({
        method: 'GET',
        url: '/posts?id=55'
    }).then(response => {
        expect(response.status).to.be.eq(200)
        console.log(response)
        expect(response.body[0].id).to.be.eqls(55)
    })
})

it('Get posts with  id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
    cy.request({
        method: 'GET',
        url: '/posts?id=60'
    }).then(response => {
        expect(response.status).to.be.eq(200)
        console.log(response)
        expect(response.body[0].id).to.be.eqls(60)
    })
})

it('Create a post. Verify HTTP response status code 401.', () => {
    cy.request({
        method: 'POST',
        url: '/664/posts/',
        failOnStatusCode: false,
    }).then(response => {
        expect(response.status).to.eq(401)
        console.log(response)
    })
})

it('Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {
    cy.request({
        method: 'POST',
        url: '/posts/',
        body: {
            "email": "fsfdsd32@mail.com",
            "password": "sd342",
            "firstname": "sdf4",
            "lastname": "fds34",
            "age": 34
        },
    }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.statusText).to.eq("Created")
        user.userId = response.body.id
        console.log(response.body.id)
    })
})

it('Update non-existing entity. Verify HTTP response status code.', () => {
    cy.request({
        method: 'PUT',
        url: '/posts/',
        body: {
            "email": "fsfsd32@mail.com",
            "password": "sd342",
            "firstname": "sdf4",
            "lastname": "fds34",
            "age": 34
        },
        failOnStatusCode: false,
    }).then(response => {
        expect(response.status).to.eq(404)
        expect(response.statusText).to.eq("Not Found")
        console.log(response)
    })
})

it('Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated.', () => {
    cy.request({
        method: 'POST',
        url: '/posts/',
        body: user
    }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.statusText).to.eq("Created")
        user.userId = response.body.id
        console.log(response.body.id)
    })



    cy.request({
        method: 'PUT',
        url: `/posts/${user.id}`,
        body: {
            "firstname": "Olivier",
            "lastname": "Monge",
            "age": 32
        }
    }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.statusText).to.eq("OK")
        expect(response.body.age).to.eql(32)
        expect(response.body.firstname).to.eq("Olivier")
        expect(response.body.lastname).to.eq("Monge")
        console.log(response)
    })

})

it('Delete non-existing post entity. Verify HTTP response status code', () => {
    cy.request({
        method: 'DELETE',
        url: '/posts/',
        body: {
            "email": "43534543@mail.com",
            "password": "fdgfgd"
        },
        failOnStatusCode: false
    }).then(response => {
        expect(response.status).to.eq(404)
        expect(response.statusText).to.eq("Not Found")
        console.log(response)
    })
})


it('Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted.', () => {
    cy.request({
        method: 'POST',
        url: '/posts/',
        body: user2
    }).then(response => {
        expect(response.status).to.eq(201)
        expect(response.statusText).to.eq("Created")
        user2.userId = response.body.id
        console.log(response.body.id)
    })

    cy.request({
        method: 'PUT',
        url: `/posts/${user2.id}`,
        body: {
            "email": "NEW_EMAIL@mail.com",
            "password": "NEW_Password",
            "firstname": "New_NAME",
            "lastname": "New_LAST_NAME",
            "age": 55
        }
    }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.statusText).to.eq("OK")
        expect(response.body.email).to.eq("NEW_EMAIL@mail.com")
        expect(response.body.password).to.eq("NEW_Password")
        expect(response.body.firstname).to.eq("New_NAME")
        expect(response.body.lastname).to.eq("New_LAST_NAME")
        expect(response.body.age).to.eql(55)
        console.log(response)
    })

    cy.request({
        method: 'DELETE',
        url: `/posts/${user2.id}`,

    }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.eql({})
        console.log(response)
    })

})



it.skip('Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {
    cy.request({
        method: 'POST',
        url: '/posts/register/',
        body: {
            "email": "test4243@mail.com",
            "password": "bestPassw0rd",
        }
    }).then(response => {
        console.log(response)
        header.accessToken = response.body.accessToken
    })

    cy.request({
        method: 'POST',
        url: '664/posts/',
        body: {
            "email": "test4243@mail.com",
            "password": "bestPassw0rd",
        },
        headers: header
    }).then(response => {
        console.log(header.accessToken)
    })
})



