describe('user happy path', () => {
  // Before each test we need to restore local storage to preserve it.
  beforeEach(() => {
    cy.restoreLocalStorage();
  })
  // After each test we save local storage.
  afterEach(() => {
    cy.saveLocalStorage();
  })
  // Before we go through a user's happy path, we need to create a listing 
  // with another user so afterwards, we can make a booking.
  it('should navigate to landing page successfully on another user', () => {
    cy.visit('localhost:3000/');
    cy.url().should('include', 'localhost:3000');
  })

  it('should navigate to register screen successfully on another user', () => {
    cy.get('button[name="registerButton"')
      .click();
    cy.url().should('include', 'localhost:3000/register');
  })

  it('should register successfully on another user', () => {
    cy.get('input[name="email"]')
      .focus()
      .type('otherUser@gmail.com');
    cy.get('input[name="name"]')
      .focus()
      .type('otherUser');
    cy.get('input[name="password"]')
      .focus()
      .type('abc');
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type('abc');
    cy.get('button[name="submit"]')
      .click();

    cy.url().should('include', 'localhost:3000/HostedListings');
    cy.get('#sideButton')
      .should('be.visible');
  })

  it('should open up listing screen successfully on another user', () => {
    cy.wait(2000);
    cy.get('button[name="createListing"]')
      .click();
    cy.get('div[name="createANewlisting"]')
      .should('have.text', 'Create a new listing');
  })

  it('should create a listing successfully on another user', () => {
    cy.get('input[name="title"]')
      .focus()
      .type('House made of poop');
    cy.get('input[name="address"]')
      .focus()
      .type('x:0');
    cy.get('input[name="city"]')
      .focus()
      .type('y:0');
    cy.get('input[name="state"]')
      .focus()
      .type('z:0');
    cy.get('input[name="postcode"]')
      .focus()
      .type(5555);
    cy.get('input[name="country"]')
      .focus()
      .type('Overworld'); 
    cy.get('#PropertyType')
      .parent()
      .click()
      .get('ul > li[data-value="Room"')
      .click();
    cy.get('input[name="price"]')
      .focus()
      .type(100000);
    cy.get('input[name="bathrooms"]')
      .focus()
      .type(1000);
    cy.get('textarea[name="amenities"]')
      .focus()
      .type('unlimited bathrooms');
    cy.get('input[name="roomType"]')
      .focus()
      .type('toilet');
    cy.get('input[name="beds"]')
      .focus()
      .clear()
      .type(5);
    
    cy.get('#thumbnailUploadButton')
      .selectFile('src/assets/test_picture_dirt.jpg');

    cy.wait(6000);
    cy.get('button[name="submit"]')
      .click();
    cy.wait(6000);
    cy.url().should('include', 'localhost:3000/HostedListings');
    cy.contains('House made of poop');
  })

  it('should open listing availability successfully on another user', () => {
    cy.get('button[name="publish"]')
      .click();

    cy.get('h2[name="availabilityTitle"]')
      .should('have.text', 'Set availability');
  })

  it('should set availability successfully on another user', () => {
    // Code to click the date button to open the date picker.
    // Then it clicks the "next month" button to go to the next month on the end date
    // Then it will select the number that is on the third row first column
    cy.contains('label', 'End Date')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .should('have.attr', 'class', 'MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
      .next()
      .should('have.attr', 'class', 'MuiInputAdornment-root MuiInputAdornment-positionEnd css-1laqsz7-MuiInputAdornment-root')
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersArrowSwitcher-root')
      .should('have.attr', 'class', 'MuiPickersArrowSwitcher-root css-9reuh9-MuiPickersArrowSwitcher-root')
      .children('.MuiIconButton-root')
      .should('have.length', 2)
      .eq(1)
      .click({ force: true })
      .get('.MuiDayPicker-monthContainer')
      .should('have.attr', 'class', 'MuiDayPicker-monthContainer css-6t5f1e-MuiDayPicker-monthContainer')
      .children('.MuiDayPicker-weekContainer')
      .eq(2)
      .should('have.attr', 'class', 'MuiDayPicker-weekContainer css-ghi3gg-MuiDayPicker-weekContainer')
      .children()
      .eq(0)
      .click({ force: true })
      
    cy.get('button[name="submit"]')
      .click();

    cy.wait(2000);
    // Publish button should not exist
    cy.get('button[name="publish"]')
      .should('not.exist');

    // Unpublish should now exist
    cy.get('button[name="unpublish"]')
      .should('be.visible');
  })

  it('should logout successfully on another user', () => {
    cy.get('#sideButton')
      .click();
    cy.get('#logoutButton')
      .click();
    
    cy.wait(2000);
    // Should be back to landing page
    cy.url().should('include', 'localhost:3000');
    // The menu icon should also not exist anymore.
    cy.get('#sideButton')
      .should('not.exist');
  })

  // Now we begin the happy path
  it('should navigate to register screen successfully', () => {
    cy.get('button[name="registerButton"')
      .click();
    cy.url().should('include', 'localhost:3000/register');
  })

  it('should register successfully', () => {
    cy.get('input[name="email"]')
      .focus()
      .type('randomEmail@gmail.com');
    cy.get('input[name="name"]')
      .focus()
      .type('student');
    cy.get('input[name="password"]')
      .focus()
      .type('abc');
    cy.get('input[name="confirmPassword"]')
      .focus()
      .type('abc');
    cy.get('button[name="submit"]')
      .click();

    // Should be on hosted listings page.
    cy.url().should('include', 'localhost:3000/HostedListings');
    // There should be a menu button top right.
    cy.get('#sideButton')
      .should('be.visible');
  })

  it('should open up listing screen successfully', () => {
    cy.wait(2000);
    cy.get('button[name="createListing"]')
      .click();
    cy.get('div[name="createANewlisting"]')
      .should('have.text', 'Create a new listing');
  })

  it('should create a listing successfully', () => {
    cy.get('input[name="title"]')
      .focus()
      .type('UNSW');
    cy.get('input[name="address"]')
      .focus()
      .type('High St Kensington');
    cy.get('input[name="city"]')
      .focus()
      .type('Randwick');
    cy.get('input[name="state"]')
      .focus()
      .type('NSW');
    cy.get('input[name="postcode"]')
      .focus()
      .type(2033);
    cy.get('input[name="country"]')
      .focus()
      .type('Australia'); 
    cy.get('#PropertyType')
      .parent()
      .click()
      .get('ul > li[data-value="Apartment"')
      .click();
    cy.get('input[name="price"]')
      .focus()
      .type(200);
    cy.get('input[name="bathrooms"]')
      .focus()
      .type(3);
    cy.get('textarea[name="amenities"]')
      .focus()
      .type('my house');
    cy.get('input[name="roomType"]')
      .focus()
      .type('living room');
    cy.get('input[name="beds"]')
      .focus()
      .clear()
      .type(2);
    cy.get('button[name="submit"]')
      .click();

    cy.url().should('include', 'localhost:3000/HostedListings');
    cy.contains('UNSW');
  })

  it('should open listing edit successfully', () => {
    cy.get('.MuiCardActionArea-root')
      .click();

    cy.url().should('include', '/edit');
  })

  it('should update listing successfully', () => {
    cy.get('input[name="title"]')
      .focus()
      .clear()
      .type('Updated UNSW');

    cy.get('#thumbnailUploadButton')
      .selectFile('src/assets/test_picture_unsw.jpg');

    cy.wait(6000);
    cy.get('#thumbnail')
      .should('be.visible');

    cy.get('button[name="submit"]')
      .click();

    cy.wait(6000);
    cy.url().should('include', 'localhost:3000/HostedListings');
    cy.contains('Updated UNSW');
  })

  it('should open listing availability successfully', () => {
    cy.get('button[name="publish"]')
      .click();

    cy.get('h2[name="availabilityTitle"]')
      .should('have.text', 'Set availability');
  })

  it('should set availability successfully', () => {
    // Code to click the date button to open the date picker.
    // Then it clicks the "next month" button to go to the next month on the end date
    // Then it will select the number that is on the third row first column
    cy.contains('label', 'End Date')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .should('have.attr', 'class', 'MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
      .next()
      .should('have.attr', 'class', 'MuiInputAdornment-root MuiInputAdornment-positionEnd css-1laqsz7-MuiInputAdornment-root')
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersArrowSwitcher-root')
      .should('have.attr', 'class', 'MuiPickersArrowSwitcher-root css-9reuh9-MuiPickersArrowSwitcher-root')
      .children('.MuiIconButton-root')
      .should('have.length', 2)
      .eq(1)
      .click({ force: true })
      .get('.MuiDayPicker-monthContainer')
      .should('have.attr', 'class', 'MuiDayPicker-monthContainer css-6t5f1e-MuiDayPicker-monthContainer')
      .children('.MuiDayPicker-weekContainer')
      .eq(2)
      .should('have.attr', 'class', 'MuiDayPicker-weekContainer css-ghi3gg-MuiDayPicker-weekContainer')
      .children()
      .eq(0)
      .click({ force: true })
      
    cy.get('button[name="submit"]')
      .click();

    cy.wait(2000);
    // Publish button should not exist
    cy.get('button[name="publish"]')
      .should('not.exist');

    // Unpublish should now exist
    cy.get('button[name="unpublish"]')
      .should('be.visible');
  })

  it('should unpublish listing successfully', () => {
    cy.get('button[name="unpublish"]')
      .click();
    cy.wait(2000);
    // Unpublish button should not exist
    cy.get('button[name="unpublish"]')
      .should('not.exist');
    // Publish should now exist
    cy.get('button[name="publish"]')
      .should('be.visible');
  })

  it('should navigate to landing page successfully', () => {    
    cy.get('#goHomeButton')
      .click();

    cy.url().should('include', 'localhost:3000');
  })

  it('should open listing info successfully', () => {
    cy.get('.MuiCardActionArea-root')
      .click();

    cy.url().should('include', '/listings');
    cy.contains('House made of poop');
  })

  it('should make booking successfully', () => {
    cy.contains('label', 'CHECK IN')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .should('have.attr', 'class', 'MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
      .next()
      .should('have.attr', 'class', 'MuiInputAdornment-root MuiInputAdornment-positionEnd css-1laqsz7-MuiInputAdornment-root')
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersDay-today')
      .click({ force: true })

    cy.contains('label', 'CHECK OUT')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .should('have.attr', 'class', 'MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
      .next()
      .should('have.attr', 'class', 'MuiInputAdornment-root MuiInputAdornment-positionEnd css-1laqsz7-MuiInputAdornment-root')
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersDay-today')
      .next()
      .click({ force: true })
    
    // Choose number on second row first column
    cy.contains('label', 'CHECK OUT')
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
      .should('have.attr', 'class', 'MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-nxo287-MuiInputBase-input-MuiOutlinedInput-input')
      .next()
      .should('have.attr', 'class', 'MuiInputAdornment-root MuiInputAdornment-positionEnd css-1laqsz7-MuiInputAdornment-root')
      .children('.MuiIconButton-root')
      .should('have.length', 1)
      .click()
      .get('.MuiPickersArrowSwitcher-root')
      .should('have.attr', 'class', 'MuiPickersArrowSwitcher-root css-9reuh9-MuiPickersArrowSwitcher-root')
      .children('.MuiIconButton-root')
      .should('have.length', 2)
      .eq(1)
      .click({ force: true })
      .get('.MuiDayPicker-monthContainer')
      .should('have.attr', 'class', 'MuiDayPicker-monthContainer css-6t5f1e-MuiDayPicker-monthContainer')
      .children('.MuiDayPicker-weekContainer')
      .eq(1)
      .should('have.attr', 'class', 'MuiDayPicker-weekContainer css-ghi3gg-MuiDayPicker-weekContainer')
      .children()
      .eq(0)
      .click({ force: true })
     
    cy.get('button[name="submit"]')
      .click();

    cy.wait(2000);
  })

  it('should logout successfully', () => {
    cy.get('#sideButton')
      .click();
    cy.get('#logoutButton')
      .click();
    
    cy.wait(2000);
    // Should be back to landing page
    cy.url().should('include', 'localhost:3000');
    // The menu icon should also not exist anymore.
    cy.get('#sideButton')
      .should('not.exist');
  })

  it('should navigate to login screen successfully', () => {
    cy.get('button[name="signInButton"')
      .click();
    cy.url().should('include', 'localhost:3000/login');
  })

  it('should login successfully', () => {
    cy.get('#email')
      .focus()
      .type('randomEmail@gmail.com');
    cy.get('#password')
      .focus()
      .type('abc');

    cy.get('button[name="submit"]')
      .click();

    // Should be on hosted listings page
    cy.url().should('include', 'localhost:3000/HostedListings');
    // Menu top right visible again
    cy.get('#sideButton')
      .should('be.visible');
  })

})