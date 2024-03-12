describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/Login')

    cy.get('div').contains('Welcome To Phommunity')
    cy.get('div').contains('Username')
    cy.get('div').contains('Password')

    // Login Process
    cy.get('#user_username').type('yuxinhu').should('have.value', 'yuxinhu')
    cy.get('#user_password').type('123dsdffe').should('have.value', '123dsdffe')
    cy.get('button').contains('Login').click()
    cy.url().should('eq', 'http://localhost:3000/')   

    // find a user
    cy.get('.UserSearchBar').type('yincenxia').should('have.value', 'yincenxia')
    cy.get('.UserSearchBarButton').click()

    // Follow the user
    cy.get('button').contains('follow').click()
    // Reset the following process and verify the following succeeds
    cy.get('button').contains('unfollow').click()
    // Unfollow the user
    cy.get('button').contains('follow')
  
  })
})