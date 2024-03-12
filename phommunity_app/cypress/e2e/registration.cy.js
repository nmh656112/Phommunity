describe('Test Registration Process', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('a').contains('Sign Up').click();  

    // determine the structure of the form exists
    cy.get('div').contains('Welcome To Phommunity')
    cy.get('div').contains('Username')
    cy.get('div').contains('Email')
    cy.get('div').contains('Password')

    // determine the textboxes' functionality
    cy.get('#user_username').type('newUserUsername').should('have.value', 'newUserUsername')
    cy.get('#user_email').type('newUserUsername@gmail.com').should('have.value', 'newUserUsername@gmail.com')
    cy.get('#user_password').type('hktk123456').should('have.value', 'hktk123456')

    // TODO invalid username
    cy.get('#user_username').clear().type('newUserUsername@')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please only enter alphanumeric username!')

    // TODO invalid email
    cy.get('#user_username').clear().type('newUserUsername')
    cy.get('#user_email').clear().type('newUserUsername')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please use correct email address')

    cy.get('#user_email').clear().type('newUserUsername@')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please use correct email address')

    cy.get('#user_email').clear().type('newUserUsername.')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please use correct email address')    

    // TODO invalid password
    cy.get('#user_username').clear().type('newUserUsername')
    cy.get('#user_email').clear().type('newUserUsername@gmail.com')
    cy.get('#user_password').clear().type('hktkasdfawet')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please contain both numbers and alphabets in your password') 

    cy.get('#user_username').clear().type('newUserUsername')
    cy.get('#user_email').clear().type('newUserUsername@gmail.com')
    cy.get('#user_password').clear().type('123456789')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please contain both numbers and alphabets in your password')

    cy.get('#user_username').clear().type('newUserUsername')
    cy.get('#user_email').clear().type('newUserUsername@gmail.com')    
    cy.get('#user_password').clear().type('12345@ht6789')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please only enter alphanumeric password!')

    // TODO password length
    cy.get('#user_username').clear().type('newUserUsername')
    cy.get('#user_email').clear().type('newUserUsername@gmail.com')
    cy.get('#user_password').clear().type('hktk123')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('Please use a longer password')

    // TODO username exists
    cy.get('#user_username').clear().type('yuxinhu')
    cy.get('#user_email').clear().type('test@gmail.com')
    cy.get('#user_password').clear().type('hktk123456')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('username already exists')    
    
    // TODO email exists
    cy.get('#user_username').clear().type('FreshNew')
    cy.get('#user_email').clear().type('ruizhan@seas.upenn.edu')
    cy.get('#user_password').clear().type('hktk123456')
    cy.get('button').contains('Sign Up').click()    
    cy.get('div').contains('email already exists')  

    // Successfull Registration
    function randomString(e) {    
      e = e || 32;
      let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      a = t.length,
      n = "";
      for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
      return n
  }
    const randomUsername = randomString(8);
    cy.get('#user_username').clear().type(`${randomUsername}d1`)
    cy.get('#user_email').clear().type(`${randomUsername}d1@gmail.com`)
    cy.get('#user_password').clear().type('hktk123456')
    cy.get('button').contains('Sign Up').click()
    cy.url().should('eq', 'http://localhost:3000/Login')



  })
})